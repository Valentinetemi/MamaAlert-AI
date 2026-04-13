import os
import google.generativeai as genai
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


# The prompt
SYSTEM_CONTEXT = """
You are the AI engine for MamaAlert, a maternal health triage tool for West Africa. 
The user will speak in English or Nigerian Pidgin.
Your task:
1. Identify if the symptoms are an EMERGENCY (High BP, bleeding, blurred vision, contractions).
2. Assign a Status: 'Emergency', 'Urgent', or 'Stable'.
3. Give 3 short, clear Action Steps.
4. Keep it empathetic. If it's an emergency, be firm: 'Go to the hospital now.'
"""

@app.post("/api/analyze")
async def analyze_health(data: TriageRequest):
    user_message = f"User is {data.weeks} weeks pregnant. Symptoms: {data.text}"
    
    try:
        #to generate the response
        response = model.generate_content(f"{SYSTEM_CONTEXT}\n\nUser: {user_message}")
        
        # Return to React
        return {
            "success": True,
            "analysis": response.text,
            "raw_text": data.text
        }
    except Exception as e:
        return {"success": False, "error": str(e)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)