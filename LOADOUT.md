---
name: live-sales-coach
version: 1.0.0
description: Real-time AI sales coaching via Gemini Live API — hackathon project ($80K prize pool)
author: AiwithDhruv
license: proprietary
tier: premium
last_verified: 2026-02-23
refresh_cadence: on-change
dependencies: []
platforms: [claude-code, cursor]
---

# Live Sales Coach — Agent Loadout

> Real-time AI sales coaching agent built for the Gemini Live Agent Challenge ($80K prize pool). Listens to live sales calls, sees prospect's screen, coaches in real-time with exact phrases.

---

## What's Included

| File | Type | Purpose |
|------|------|---------|
| `README.md` | Context | Architecture, stack, project structure |
| `UX-PILOT-PROMPTS.md` | Skill | Coaching prompt templates |
| `backend/` | Code | Python + FastAPI + WebSocket + ADK |
| `frontend/` | Code | React + Vite + TypeScript + Tailwind |
| `docs/` | Knowledge | Additional documentation |

---

## Quick Reference

| Field | Value |
|-------|-------|
| **Hackathon** | Gemini Live Agent Challenge |
| **Prize Pool** | $80,000 |
| **Status** | BUILT, not deployed |
| **AI Core** | Google ADK + Gemini 2.5 Flash (native audio) |
| **Backend** | Python + FastAPI + WebSocket |
| **Frontend** | React + Vite + TypeScript + Tailwind |
| **Cloud** | Google Cloud Run |
| **Post-call** | n8n webhook for CRM logging |

### Two Modes
1. **Live Coaching** — Silent overlays during real sales calls
2. **Practice Mode** — AI role-plays as prospect + whispered coaching tips

### Architecture
```
Browser (React) ←WebSocket→ FastAPI Server ←Live API→ Gemini 2.5 Flash
  ├── Audio capture (16kHz PCM)     ├── ADK Agent with tools
  ├── Screen share (JPEG frames)    ├── Coaching prompts
  └── Dashboard rendering           └── Objection detection → CRM logging
```

---

## Self-Update Rules

| Event | Update | File |
|-------|--------|------|
| Hackathon result | Record prize/ranking | This file |
| Deployed to production | Update status + URL | This file |
| New coaching prompt added | Add to prompts | `UX-PILOT-PROMPTS.md` |
| Architecture changed | Update diagram | `README.md` |

---

## Changelog

### v1.0.0 (2026-02-23)
- Initial loadout from hackathon project
