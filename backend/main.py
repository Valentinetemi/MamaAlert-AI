import os
import json
import re
from pathlib import Path
from typing import Literal

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import httpx


load_dotenv(Path(__file__).resolve().parent / ".env")

app = FastAPI(title="MamaAlert API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3001",
        "https://mama-alert-ai.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.0-flash-lite")

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

EMERGENCY_RULES = [
    (
        ("bleeding", "blood", "spotting", "clot"),
        "Bleeding during pregnancy can become serious quickly, especially if it is heavy, painful, or comes with dizziness.",
    ),
    (
        ("convulsion", "seizure", "fit", "fitting"),
        "Convulsions or seizures in pregnancy are an emergency and need immediate medical care.",
    ),
    (
        ("severe headache", "bad headache", "worst headache"),
        "A severe headache in pregnancy can be a warning sign, especially with swelling, high blood pressure, or vision changes.",
    ),
    (
        ("blurred vision", "blurry vision", "seeing spots", "vision"),
        "Vision changes in pregnancy can be a warning sign of high blood pressure or pre-eclampsia.",
    ),
    (
        ("reduced movement", "baby not moving", "not moving", "no movement", "less movement", "decreased movement"),
        "Reduced baby movement should be checked urgently so the baby can be assessed.",
    ),
    (
        ("difficulty breathing", "shortness of breath", "can't breathe", "cannot breathe"),
        "Trouble breathing can be dangerous in pregnancy and needs urgent assessment.",
    ),
    (
        ("chest pain", "fainting", "collapsed", "unconscious"),
        "Chest pain, fainting, or collapse can signal a serious emergency.",
    ),
]

CAUTION_RULES = [
    (
        ("fever", "hot body", "temperature", "chills"),
        "Fever in pregnancy can affect both mother and baby and should be reviewed by a health worker.",
    ),
    (
        ("vomiting", "throwing up", "can't keep food", "cannot keep food"),
        "Ongoing vomiting can cause dehydration, so it is important to monitor fluids and get help if it continues.",
    ),
    (
        ("swelling", "swollen", "puffy face", "puffy hands"),
        "New or sudden swelling can be a warning sign when it happens with headache, vision changes, or pain.",
    ),
    (
        ("abdominal pain", "stomach pain", "cramps", "pelvic pain"),
        "Pain in pregnancy can have many causes, and persistent or severe pain should be checked.",
    ),
    (
        ("burning urine", "painful urination", "urine pain", "uti"),
        "Painful urination may be a urinary infection, which should be treated during pregnancy.",
    ),
    (
        ("nausea", "morning sickness", "feel sick"),
        "Nausea is common in pregnancy, but contact your clinic if you cannot eat, keep fluids down, or lose weight.",
    ),
]

SAFE_RULES = [
    (
        ("tired", "fatigue", "tiredness", "exhausted", "weakness", "low energy"),
        "Feeling tired during pregnancy is very common, especially as your body works hard to support your growing baby.",
        [
            "Rest when you can and aim for regular sleep through the night.",
            "Eat small, balanced meals and sip water often during the day.",
            "Tell your midwife or doctor at your next visit if exhaustion is sudden, severe, or getting worse.",
        ],
    ),
    (
        ("headache", "head ache"),
        "Mild headaches can happen in pregnancy because of hormones, tiredness, dehydration, or stress.",
        [
            "Drink water, rest in a quiet room, and avoid skipping meals.",
            "Contact your clinic today if the headache is severe, sudden, or comes with swelling, vision changes, or upper belly pain.",
            "Go to emergency care immediately if you also have bleeding, fainting, or reduced baby movement.",
        ],
    ),
    (
        ("back pain", "backache", "back ache", "lower back"),
        "Back pain is common as pregnancy progresses and your posture and weight distribution change.",
        [
            "Use a supportive pillow when sitting or sleeping and avoid lifting heavy loads.",
            "Try gentle stretches or a short walk if you feel up to it.",
            "See your care provider if pain is severe, sharp, or comes with fever, bleeding, or painful urination.",
        ],
    ),
    (
        ("heartburn", "acid reflux", "chest burn"),
        "Heartburn is common in pregnancy as hormones relax digestion and the growing womb presses on the stomach.",
        [
            "Eat smaller meals and avoid lying down right after eating.",
            "Try plain foods and sip water between meals rather than with food.",
            "Speak to your clinic if heartburn is severe, causes vomiting, or stops you eating properly.",
        ],
    ),
    (
        ("constipation", "hard stool", "cannot pass stool"),
        "Constipation is common in pregnancy because digestion slows down.",
        [
            "Drink plenty of water and include fibre-rich foods like vegetables, fruits, and whole grains.",
            "Stay gently active if you can, such as a short daily walk.",
            "Contact your clinic before using any laxative or herbal remedy during pregnancy.",
        ],
    ),
    (
        ("leg cramp", "leg cramps", "cramps in leg", "charley horse"),
        "Leg cramps are common in later pregnancy and often happen at night.",
        [
            "Stretch your calf gently, massage the muscle, and walk around slowly when a cramp starts.",
            "Stay hydrated and consider discussing magnesium-rich foods with your care team.",
            "Seek advice if cramps are frequent, very painful, or come with swelling or redness in one leg.",
        ],
    ),
]


def contains_any(text: str, terms: tuple[str, ...]) -> bool:
    return any(term in text for term in terms)


def rule_based_triage(text: str) -> dict | None:
    normalized = text.lower().strip()
    if not normalized:
        return None

    for terms, reason in EMERGENCY_RULES:
        if contains_any(normalized, terms):
            return {
                "analysis": reason,
                "urgency": "emergency",
                "recommendations": [
                    "Go to the nearest hospital or maternity emergency unit now.",
                    "Call emergency services on 112 if you cannot get transport quickly.",
                    "Do not wait at home for symptoms to pass before seeking care.",
                ],
                "source": "safety_rules",
            }

    for terms, reason in CAUTION_RULES:
        if contains_any(normalized, terms):
            return {
                "analysis": reason,
                "urgency": "caution",
                "recommendations": [
                    "Contact your doctor, midwife, or clinic today for advice.",
                    "Drink water if you can and note when the symptom started.",
                    "Go to emergency care immediately if the symptom becomes severe or is joined by bleeding, fainting, severe headache, vision changes, or reduced baby movement.",
                ],
                "source": "safety_rules",
            }

    for terms, reason, recommendations in SAFE_RULES:
        if contains_any(normalized, terms):
            return {
                "analysis": reason,
                "urgency": "safe",
                "recommendations": recommendations,
                "source": "safety_rules",
            }

    return None


def offline_guidance(text: str, error: str | None = None) -> dict:
    matched = rule_based_triage(text)
    if matched:
        return matched

    return {
        "analysis": (
            "Our AI guide is temporarily unavailable, but your symptoms were logged. "
            "For anything new, worsening, or worrying, contact your midwife or clinic today."
        ),
        "urgency": "caution",
        "recommendations": [
            "Describe your symptoms to your doctor or midwife and ask whether you need to be seen today.",
            "Rest, drink water, and note when symptoms started and whether they are getting better or worse.",
            "Go to emergency care on 112 if you develop bleeding, severe pain, fainting, trouble breathing, or reduced baby movement.",
        ],
        "error": error,
        "source": "offline",
    }


def normalize_triage(parsed: dict, symptom: str) -> dict:
    raw_urgency = str(parsed.get("urgency", "caution")).lower().strip()
    urgency: Literal["safe", "caution", "emergency"] = URGENCY_MAP.get(raw_urgency, "caution")  # type: ignore[assignment]
    recommendations = parsed.get("recommendations", FALLBACK_RESPONSE["recommendations"])
    if not isinstance(recommendations, list) or not recommendations:
        recommendations = FALLBACK_RESPONSE["recommendations"]

    return {
        "symptom": symptom,
        "analysis": parsed.get("analysis", FALLBACK_RESPONSE["analysis"]),
        "urgency": urgency,
        "recommendations": recommendations[:5],
        "source": parsed.get("source", "gemini"),
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
    safety_result = rule_based_triage(request.text)
    if safety_result:
        return {"symptom": request.text, **safety_result}

    if not GEMINI_API_KEY:
        offline = offline_guidance(request.text, "GEMINI_API_KEY is missing from .env")
        return {"symptom": request.text, **offline}

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

Always mark these as emergency: bleeding, convulsions or seizures, severe headache with vision change or swelling, reduced baby movement, trouble breathing, chest pain, fainting, or collapse.
Be warm, clear, and supportive. Write for a general audience, not medical professionals.
"""

    url = (
        f"https://generativelanguage.googleapis.com/v1beta"
        f"/models/{GEMINI_MODEL}:generateContent?key={GEMINI_API_KEY}"
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
        try:
            response = await client.post(url, json=payload)
        except httpx.HTTPError:
            offline = offline_guidance(request.text, "Unable to reach Gemini API")
            return {"symptom": request.text, **offline}

    if response.status_code != 200:
        error_hint = {
            401: "Invalid GEMINI_API_KEY — get a key from https://aistudio.google.com/apikey",
            403: "Gemini API access denied — check your API key permissions",
            429: "Gemini API quota exceeded — using local guidance for now. Check https://ai.dev/rate-limit",
        }.get(response.status_code, f"Gemini API error ({response.status_code})")
        offline = offline_guidance(request.text, error_hint)
        return {"symptom": request.text, **offline}

    gemini_data = response.json()
    
    try: 
        raw_text = gemini_data['candidates'][0]['content']['parts'][0]['text']
    except  (KeyError, IndexError):
        offline = offline_guidance(request.text, "Unexpected Gemini response structure")
        return {"symptom": request.text, **offline}

    if not raw_text:
        offline = offline_guidance(request.text, "Empty Gemini response")
        return {"symptom": request.text, **offline}

    try:
        parsed = extract_json(raw_text)
    except (ValueError, json.JSONDecodeError):
        offline = offline_guidance(request.text, "Could not parse Gemini response")
        return {"symptom": request.text, **offline}
    
    return normalize_triage(parsed, request.text)

@app.get("/")
def home():
    return {"message": "MamaAlert API is running!"}

@app.get("/api/health")
def health():
    return {
        "status": "ok",
        "service": "MamaAlert API",
        "gemini_configured": bool(GEMINI_API_KEY),
    }
