"""Configuration for Live Sales Coach Agent."""

import os
from dotenv import load_dotenv

load_dotenv()

# Gemini Live API model for streaming audio/video
LIVE_MODEL = "gemini-2.5-flash-native-audio-preview-12-2025"

# Standard Gemini model for non-streaming tasks
STANDARD_MODEL = "gemini-2.0-flash"

# Gemini voice for practice mode audio output
COACH_VOICE = "Kore"  # Professional female voice

# Google Cloud
GCP_PROJECT = os.getenv("GOOGLE_CLOUD_PROJECT", "")
GCP_LOCATION = os.getenv("GOOGLE_CLOUD_LOCATION", "us-central1")
USE_VERTEX = os.getenv("GOOGLE_GENAI_USE_VERTEXAI", "FALSE").upper() == "TRUE"

# n8n webhook for post-call CRM logging
N8N_WEBHOOK_URL = os.getenv("N8N_WEBHOOK_URL", "")

# Firestore collection for call logs
FIRESTORE_COLLECTION = "call_logs"

# Server
HOST = os.getenv("HOST", "0.0.0.0")
PORT = int(os.getenv("PORT", "8080"))
