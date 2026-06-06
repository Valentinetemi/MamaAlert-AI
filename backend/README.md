# MamaAlert Backend

FastAPI service for maternal symptom triage.

## Setup

Install Python 3.11 or newer, then run:

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
Copy-Item .env.example .env
```

Add your Gemini key to `backend/.env`:

```env
GEMINI_API_KEY=your-gemini-api-key
```

## Run

```powershell
python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```

Health check:

```powershell
curl http://127.0.0.1:8000/api/health
```

Triage test:

```powershell
curl -X POST http://127.0.0.1:8000/api/analyze `
  -H "Content-Type: application/json" `
  -d "{\"text\":\"I am bleeding and dizzy\",\"lang\":\"en\",\"weeks\":28}"
```

## Safety Behavior

The API checks high-risk maternal danger signs before calling Gemini. These rule-based checks return emergency guidance even when `GEMINI_API_KEY` is missing or the AI service is unavailable.
