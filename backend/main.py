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
        f"/models/gemini-2.0-flash-lite:streamGenerateContent?alt=sse&key={GEMINI_API_KEY}"
    )

    payload = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {
            "temperature": 0.3,
            "maxOutputTokens": 512,
        },
    }

    async def stream_response():
        collected = ""

        import threading
        result_holder = {}
        
        def do_request():
            r = requests.post(url, json=payload, timeout=50, stream=True)
            result_holder["response"] = r

        thread = threading.Thread(target=do_request)
        thread.start()
        thread.join()
        
        r = result_holder.get("response")
        if not r or r.status_code != 200:
            yield json.dumps({"symptom": request.text, **FALLBACK_RESPONSE}) + "\n"
            return

        for line in r.iter_lines():
            if not line:
                continue
            decoded = line.decode("utf-8")
            if decoded.startswith("data: "):
                decoded = decoded[6:]
            try:
                chunk = json.loads(decoded)
                text_chunk = (
                    chunk.get("candidates", [{}])[0]
                    .get("content", {})
                    .get("parts", [{}])[0]
                    .get("text", "")
                )
                if text_chunk:
                    collected += text_chunk
                    # stream partial analysis as plain text for an instant feel
                    yield json.dumps({"partial": text_chunk}) + "\n"
            except Exception:
                continue

        # Once fully collected, parse and send the final structured response
        try:
            parsed = extract_json(collected)
            raw_urgency = str(parsed.get("urgency", "caution")).lower().strip()
            urgency = URGENCY_MAP.get(raw_urgency, "caution")
            recommendations = parsed.get("recommendations", [])
            if not isinstance(recommendations, list) or len(recommendations) == 0:
                recommendations = FALLBACK_RESPONSE["recommendations"]

            yield json.dumps({
                "done": True,
                "symptom": request.text,
                "analysis": parsed.get("analysis", FALLBACK_RESPONSE["analysis"]),
                "urgency": urgency,
                "recommendations": recommendations,
            }) + "\n"
        except Exception:
            yield json.dumps({"done": True, "symptom": request.text, **FALLBACK_RESPONSE}) + "\n"

    return StreamingResponse(stream_response(), media_type="text/event-stream")

@app.get("/")
def home():
    return {"message": "MamaAlert API is running!"}