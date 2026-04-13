from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Allowing React frontend to talk to Python API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class TriageRequest(BaseModel):
    text: str
    weeks: int = 28

# The Knowledge Base: Localized symptoms -> Severity
KNOWLEDGE_BASE = {
    "eye dey dark": {"label": "Visual Disturbance", "weight": 4},
    "blurry": {"label": "Visual Disturbance", "weight": 4},
    "head dey pain": {"label": "Severe Headache", "weight": 3},
    "headache": {"label": "Severe Headache", "weight": 3},
    "leg dey swell": {"label": "Edema", "weight": 2},
    "swollen": {"label": "Edema", "weight": 2},
    "belle dey strong": {"label": "Contractions", "weight": 4},
    "blood": {"label": "Bleeding", "weight": 5},
    "water don break": {"label": "Ruptured Membranes", "weight": 5},
}

@app.post("/api/triage")
async def analyze_symptoms(data: TriageRequest):
    user_input = data.text.lower()
    score = 0
    detected = []

    for phrase, info in KNOWLEDGE_BASE.items():
        if phrase in user_input:
            score += info["weight"]
            detected.append(info["label"])

    # The decision Matrix
    if score >= 4:
        result = {"status": "EMERGENCY", "color": "#fee2e2", "msg": "Go to the hospital NOW."}
    elif score >= 2:
        result = {"status": "URGENT", "color": "#fef3c7", "msg": "Call your doctor immediately."}
    else:
        result = {"status": "STABLE", "color": "#f0fdf4", "msg": "Monitor symptoms and rest."}

    return {
        "analysis": result,
        "score": score,
        "detected_symptoms": list(set(detected)), 
        "provider_note": "Risk assessment based on localized NLP engine."
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)