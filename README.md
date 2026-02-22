# Live Sales Coach

Real-time AI sales coaching agent powered by **Gemini Live API** and **Google ADK**.

Built for the [Gemini Live Agent Challenge](https://geminiliveagentchallenge.devpost.com/) ($80K prize pool).

## What It Does

A multimodal AI agent that coaches salespeople during live calls:

1. **Listens** to live sales calls via audio input (Gemini Live API)
2. **Sees** the prospect's website/LinkedIn via screen sharing (visual input)
3. **Coaches** in real-time with exact phrases to say (dashboard output)
4. **Tracks** objection counters, sentiment, talk-time ratio (visual metrics)
5. **Logs** everything to CRM post-call (n8n workflow)

### Two Modes

- **Live Coaching**: Silent coaching overlays during real calls
- **Practice Mode**: AI prospect role-plays + whispered coaching tips

## Tech Stack

| Component | Technology |
|-----------|-----------|
| AI Core | Google ADK + Gemini 2.5 Flash Native Audio |
| Backend | Python + FastAPI + WebSocket |
| Frontend | React + Vite + TypeScript + Tailwind CSS |
| Cloud | Google Cloud Run |
| Post-call | n8n webhook for CRM logging |

## Quick Start

### Backend

```bash
cd backend
cp .env.example .env
# Add your GOOGLE_API_KEY to .env
pip install .
python main.py
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173

## Architecture

```
Browser (React)  <-- WebSocket -->  FastAPI Server  <-- Live API -->  Gemini 2.5 Flash
     |                                    |
     |-- Audio capture (16kHz PCM)        |-- ADK Agent with tools
     |-- Screen share (JPEG frames)       |-- Coaching prompts
     |-- Dashboard rendering              |-- Objection detection
                                          |-- Post-call CRM logging
```

## Project Structure

```
live-sales-coach/
├── backend/
│   ├── app/
│   │   ├── agent.py          # ADK agent definition
│   │   ├── tools/            # Dashboard, CRM, coaching tools
│   │   └── prompts/          # System prompts, personas, objections
│   ├── main.py               # FastAPI + WebSocket server
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/       # Dashboard UI components
│   │   ├── hooks/            # WebSocket, audio, screen share hooks
│   │   └── lib/              # Types
│   └── package.json
└── README.md
```

## Built By

[AIwithDhruv](https://linkedin.com/in/aiwithdhruv)
