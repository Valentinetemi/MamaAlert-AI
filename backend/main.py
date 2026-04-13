import os
import google.generativeai as genai
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

# 1. SETUP
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Replace with your actual key
genai.configure(api_key="YOUR_GEMINI_API_KEY_HERE")

# 2. THE MODEL (Flash is fastest for hackathons)
model = genai.GenerativeModel('gemini-1.5-flash')

class TriageRequest(BaseModel):
    text: str
    weeks: int

# 3. THE "MEDICAL EXPERT" PROMPT
# This tells Gemini exactly how to behave so it doesn't give generic advice.
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
        # Generate the response
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