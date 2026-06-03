import os
import json
import re
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import requests
from fastapi.responses import StreamingResponse
import asyncio
import httpx


load_dotenv()

app = FastAPI(title="MamaAlert API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3001",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

URGENCY_MAP = {
    "emergency": "emergency",
    "urgent":    "emergency",
    "caution":   "caution",
    "moderate":  "caution",
    "stable":    "safe",
    "safe":      "safe",
    "normal":    "safe",
}

FALLBACK_RESPONSE = {
    "analysis": "We were unable to process your symptoms at this time. Please consult your healthcare provider directly.",
    "urgency": "caution",
    "recommendations": [
        "Contact your doctor or midwife as soon as possible.",
        "Monitor your symptoms and note any changes.",
        "If symptoms worsen suddenly, call emergency services on 112.",
    ],
}


def extract_json(text: str) -> dict:
    """
    Gemini sometimes wraps its JSON in markdown code fences.
    This strips them and parses the JSON safely.
    """
    
    clean = re.sub(r"```(?:json)?", "", text).replace("```", "").strip()

    # Gemini adds text before/after the JSON object, find the first {...}
    match = re.search(r"\{.*\}", clean, re.DOTALL)
    if not match:
        raise ValueError("No JSON object found in Gemini response")

    return json.loads(match.group())


class TriageRequest(BaseModel):
    text: str
    lang: str = "en"    
    weeks: int = 28

@app.post("/api/analyze")
async def analyze_symptoms(request: TriageRequest):
    if not GEMINI_API_KEY:
        return {
            "symptom": request.text,
            **FALLBACK_RESPONSE,
            "error": "GEMINI_API_KEY is missing from .env",
        }

    prompt = f"""
You are a compassionate maternal health expert helping a pregnant Nigerian woman.
She is {request.weeks} weeks pregnant and has reported the following symptom(s): "{request.text}"

Respond ONLY with a valid JSON object in this exact format, no extra text, no markdown:
{{
  "analysis": "A warm, clear 2-3 sentence explanation of what these symptoms may indicate and why.",
  "urgency": "emergency|caution|safe",
  "recommendations": [
    "First specific action to take",
    "Second specific action to take",
    "Third specific action to take"
  ]
}}

Urgency rules:
- "emergency" = symptoms are potentially life-threatening, act immediately
- "caution" = symptoms need medical attention within 24 hours
- "safe" = symptoms are mild and can be monitored at home

Be warm, clear, and supportive. Write for a general audience, not medical professionals.
"""

    url = (
        f"https://generativelanguage.googleapis.com/v1beta"
        f"/models/gemini-2.0-flash-lite:generateContent?key={GEMINI_API_KEY}"
    )

    payload = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {
            "response_mime_type": "application/json", # Forces Gemini to return JSON
            "temperature": 0.3,
            "maxOutputTokens": 512,
        },
    }

    async with httpx.AsyncClient(timeout=50) as client:
        response = await client.post(url, json=payload)

    if response.status_code != 200:
        return {"symptom": request.text, **FALLBACK_RESPONSE, "debug": response.status_code}

    gemini_data = response.json()
    
    try: 
        raw_text = gemini_data['candidates'][0]['content']['parts'][0]['text']
    except  (KeyError, IndexError):
        return {"symptom": request.text, **FALLBACK_RESPONSE, "error": "Unexpected JSON structure"}

    if not raw_text:
        return {"symptom": request.text, **FALLBACK_RESPONSE}

    parsed = extract_json(raw_text)
    
    raw_urgency = str(parsed.get("urgency", "caution")).lower().strip()
    urgency = URGENCY_MAP.get(raw_urgency, "caution")
    recommendations = parsed.get("recommendations", FALLBACK_RESPONSE["recommendations"])
    if not isinstance(recommendations, list) or not recommendations:
        recommendations = FALLBACK_RESPONSE["recommendations"]

    return {
        "symptom": request.text,
        "analysis": parsed.get("analysis", FALLBACK_RESPONSE["analysis"]),
        "urgency": urgency,
        "recommendations": recommendations,
    }

@app.get("/")
def home():
    return {"message": "MamaAlert API is running!"}
