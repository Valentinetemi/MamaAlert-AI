import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import requests
import json
import re

load_dotenv()

app = FastAPI(title="MamaAlert API")

# ==================== FIXED CORS ====================
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

class TriageRequest(BaseModel):
    text: str
    lang: str = "en"
    weeks: int = 28  # default value


@app.post("/api/analyze")
async def analyze_symptoms(request: TriageRequest):
    if not GEMINI_API_KEY:
        return {"error": "GEMINI_API_KEY missing in .env"}

    prompt = f"""
You are a maternal health expert. The user is {request.weeks} weeks pregnant.
Symptom reported: "{request.text}"

Respond in this exact JSON format:
{{
  "analysis": "Short clear explanation",
  "urgency": "emergency|urgent|stable|caution",
  "recommendations": ["action 1", "action 2", "action 3"]
}}
"""

    payload = {
        "contents": [{
            "parts": [{"text": prompt}]
        }]
    }

    try:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key={GEMINI_API_KEY}"
        
        response = requests.post(url, json=payload, timeout=50)
        
        if response.status_code != 200:
            return {
                "error": "Gemini API error",
                "status_code": response.status_code
            }

        gemini_data = response.json()
        # Extract the text response from Gemini
        try:
            
            ai_text = gemini_data["candidates"][0]["content"]["parts"][0]["text"]
    
    # Strip markdown code fences Gemini sometimes wraps around JSON
     clean = re.sub(r"```(?:json)?|```", "", ai_text).strip()
    
    parsed = json.loads(clean)
    
    # Normalize urgency — map Gemini values to your frontend keys
    urgency_map = {
        "emergency": "emergency",
        "urgent":    "emergency",  # treat urgent as emergency
        "caution":   "caution",
        "stable":    "safe",       # map stable → safe
        "safe":      "safe",
    }
    raw_urgency = parsed.get("urgency", "caution").lower()
    urgency = urgency_map.get(raw_urgency, "caution")
    
    return {
        "symptom": request.text,
        "analysis": parsed.get("analysis", ai_text),
        "urgency": urgency,
        "recommendations": parsed.get("recommendations") or [],
    }

@app.get("/")
def home():
    return {"message": "MamaAlert API is running!"}