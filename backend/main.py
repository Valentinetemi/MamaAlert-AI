import os
import requests
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

from dotenv import load_dotenv

load_dotenv() # This loads the variables from .env

# SETUP
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pull key from environment
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_URL = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={GEMINI_API_KEY}"

class TriageRequest(BaseModel):
    text: str
    weeks: int

@app.post("/api/analyze")
async def analyze_health(data: TriageRequest):
    prompt = (
        f"Maternal health triage. User is {data.weeks} weeks pregnant. "
        f"Symptom: '{data.text}'. "
        "Provide: 1. Status (Emergency/Urgent/Stable). 2. Action steps."
    )
    
    payload = {"contents": [{"parts": [{"text": prompt}]}]}
    
    try:
        # Check if key exists
        if not GEMINI_API_KEY:
            return {"error": "API Key missing in .env"}
            
        response = requests.post(GEMINI_URL, json=payload, timeout=10)
        return response.json()
    except Exception as e:
        return {"error": "Connection failed", "details": str(e)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)