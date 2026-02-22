"""
Live Sales Coach — FastAPI Server

WebSocket-based server that bridges the React frontend with the ADK agent.
Handles bidirectional audio/video streaming via Gemini Live API.
"""

import asyncio
import json
import os
import base64
from contextlib import asynccontextmanager

from dotenv import load_dotenv
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from google.adk.runners import Runner
from google.adk.sessions import InMemorySessionService
from google.genai import types

from app.agent import root_agent
from app.config import HOST, PORT

load_dotenv()

# Session management
session_service = InMemorySessionService()
runner = Runner(
    agent=root_agent,
    app_name="live_sales_coach",
    session_service=session_service,
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application startup/shutdown."""
    print("Live Sales Coach server starting...")
    yield
    print("Server shutting down.")


app = FastAPI(
    title="Live Sales Coach",
    description="Real-time AI sales coaching powered by Gemini Live API",
    version="0.1.0",
    lifespan=lifespan,
)

# CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health():
    """Health check endpoint."""
    return {"status": "healthy", "agent": "live_sales_coach"}


@app.get("/api/personas")
async def get_personas():
    """Return available practice personas."""
    from app.prompts.personas import PERSONAS

    return {
        "personas": [
            {
                "id": pid,
                "name": p["name"],
                "title": p["title"],
                "company": p["company"],
                "difficulty": p["difficulty"],
                "industry": p["industry"],
            }
            for pid, p in PERSONAS.items()
        ]
    }


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    """Main WebSocket endpoint for live coaching sessions.

    Protocol:
    - Client sends: {"type": "audio", "data": "<base64 PCM>"} for audio chunks
    - Client sends: {"type": "image", "data": "<base64 JPEG>"} for screen/webcam frames
    - Client sends: {"type": "text", "text": "..."} for text messages
    - Client sends: {"type": "config", ...} for session configuration
    - Client sends: {"type": "end"} to end the session
    - Server sends: {"type": "tool_result", "data": {...}} for dashboard updates
    - Server sends: {"type": "audio", "data": "<base64 PCM>"} for audio responses
    - Server sends: {"type": "transcript", "text": "..."} for transcriptions
    - Server sends: {"type": "turn_complete"} when model finishes responding
    """
    await websocket.accept()
    print("Client connected")

    # Create session for this connection
    session = await session_service.create_session(
        app_name="live_sales_coach",
        user_id="user_1",
    )

    try:
        # Use ADK's streaming capabilities via run_live
        live_events = runner.run_live(
            session=session,
            live_request_queue=asyncio.Queue(),
        )

        request_queue = live_events  # Will be replaced with proper queue

        # For now, use a simpler request-response pattern
        # until we integrate the full bidi-streaming
        while True:
            raw = await websocket.receive_text()
            msg = json.loads(raw)

            if msg["type"] == "end":
                break

            if msg["type"] == "text":
                # Process text input through the agent
                content = types.Content(
                    role="user",
                    parts=[types.Part(text=msg["text"])],
                )

                async for event in runner.run_async(
                    user_id="user_1",
                    session_id=session.id,
                    new_message=content,
                ):
                    # Check for tool calls (dashboard updates, objections, etc.)
                    if event.actions and event.actions.tool_calls:
                        for tool_call in event.actions.tool_calls:
                            await websocket.send_json({
                                "type": "tool_call",
                                "name": tool_call.name,
                                "args": tool_call.args,
                            })

                    # Send text responses
                    if event.content and event.content.parts:
                        for part in event.content.parts:
                            if part.text:
                                await websocket.send_json({
                                    "type": "text",
                                    "text": part.text,
                                })

                    # Check for tool results (contains dashboard data)
                    if event.actions and event.actions.tool_results:
                        for result in event.actions.tool_results:
                            await websocket.send_json({
                                "type": "tool_result",
                                "data": result,
                            })

                await websocket.send_json({"type": "turn_complete"})

            elif msg["type"] == "audio":
                # Audio chunks will be processed by Gemini Live API
                # This is a placeholder — full bidi-streaming in next phase
                await websocket.send_json({
                    "type": "status",
                    "message": "Audio received, processing...",
                })

            elif msg["type"] == "image":
                # Screen/webcam frames for visual context
                await websocket.send_json({
                    "type": "status",
                    "message": "Image received, analyzing...",
                })

    except WebSocketDisconnect:
        print("Client disconnected")
    except Exception as e:
        print(f"WebSocket error: {e}")
        try:
            await websocket.send_json({
                "type": "error",
                "message": str(e),
            })
        except Exception:
            pass


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host=HOST,
        port=PORT,
        reload=True,
    )
