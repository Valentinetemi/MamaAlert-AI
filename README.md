# MamaAlert AI 🌸

An AI-powered maternal health companion for pregnant 
women in Nigeria.

## What it does

MamaAlert helps pregnant women track their health and 
get instant AI guidance when they need it most.

- Voice and symptom triage powered by Gemini AI
- Urgency levels — Emergency, Monitor, Normal
- Pregnancy week and hydration tracking
- Culturally relevant Nigerian nutrition guidance
- Nearest hospital finder with direct call button
- Supabase authentication and data storage

## Live Demo

🔗 https://mama-alert-ai.vercel.app/landing

## Demo Video

🎥 https://youtu.be/Dfkc3WVauFE

## Tech Stack

- Frontend: Next.js, TypeScript
- Backend: FastAPI, Python
- AI: Google Gemini API
- Database and Auth: Supabase
- Frontend Deployment: Vercel
- Backend Deployment: Render

## Getting Started

```bash
# Clone the repo
git clone https://github.com/Valentinetemi/MamaAlert-AI

# Install frontend dependencies
cd frontend
npm install
npm run dev

# Install backend dependencies
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

## Environment Variables

Create a `.env` file in both frontend and backend:

**Frontend:**
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
NEXT_PUBLIC_API_URL=your_backend_url

```
**Backend:**
```
GEMINI_API_KEY=your_gemini_key
```

## Built With ❤️ for Nigerian Mothers

Built for the GitHub Finish-Up-A-Thon Challenge 2026.
