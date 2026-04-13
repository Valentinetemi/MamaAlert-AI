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
GEMINI_URL = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key={GEMINI_API_KEY}"
class TriageRequest(BaseModel):
    text: str
    weeks: int

@app.post("/api/analyze")
async def analyze(data: TriageRequest):
    # key to the triage logic
    prompt = (
        f"Maternal health triage. User is {data.weeks} weeks pregnant. "
        f"Symptom: '{data.text}'. "
        "Provide: 1. Status (Emergency/Urgent/Stable). 2. Action steps."
    )
    

    payload = {
        "contents": [{
            "parts": [{
                "text": prompt
            }]
        }]
    }
    
#used gemini-3-flash-preview
    TARGET_URL = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key={GEMINI_API_KEY}"
    try:
        if not GEMINI_API_KEY:
            return {"error": "API Key missing in .env"}
            
        response = requests.post(TARGET_URL, json=payload, timeout=50)
        
        if response.status_code != 200:
            return {
                "error": "Gemini API Error",
                "status_code": response.status_code,
                "details": response.json()
            }
            
        return response.json()
        
    except Exception as e:
        return {"error": "Connection failed", "details": str(e)}
    
@app.get("/")
def home():
    return {"message": "MamaAlert API is working! Use /api/analyze for symptoms."}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)