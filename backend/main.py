"""
Live Sales Coach — FastAPI Server

WebSocket-based server that bridges the React frontend with the ADK agent.
Handles bidirectional audio/video streaming via Gemini Live API.

Two modes:
  1. Live Coaching — TEXT output (silent dashboard overlay during real calls)
  2. Practice Mode  — AUDIO output (whispered coaching + AI prospect voice)
"""

import asyncio
import base64
import json
import traceback
from contextlib import asynccontextmanager

from dotenv import load_dotenv
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from google.adk.agents.live_request_queue import LiveRequestQueue
from google.adk.agents.run_config import RunConfig
from google.adk.runners import Runner
from google.adk.sessions import InMemorySessionService
from google.genai import types

from app.agent import root_agent, create_practice_agent
from app.config import COACH_VOICE, HOST, PORT

load_dotenv()

# ---------------------------------------------------------------------------
# ADK Runner setup
# ---------------------------------------------------------------------------
session_service = InMemorySessionService()

# Default runner for live coaching mode
live_runner = Runner(
    agent=root_agent,
    app_name="live_sales_coach",
    session_service=session_service,
)


# ---------------------------------------------------------------------------
# App lifecycle
# ---------------------------------------------------------------------------
@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Live Sales Coach server starting...")
    yield
    print("Server shutting down.")


app = FastAPI(
    title="Live Sales Coach",
    description="Real-time AI sales coaching powered by Gemini Live API",
    version="0.1.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------------------------
# REST endpoints
# ---------------------------------------------------------------------------
@app.get("/health")
async def health():
    return {"status": "healthy", "agent": "live_sales_coach"}


@app.get("/api/personas")
async def get_personas():
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


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------
def _build_run_config(mode: str = "live", voice: str = COACH_VOICE) -> RunConfig:
    """Build RunConfig for the requested session mode.

    Live Coaching  → TEXT modality (dashboard updates only, no audio out)
    Practice Mode  → AUDIO modality (whispered coaching + AI prospect voice)
    """
    if mode == "practice":
        return RunConfig(
            response_modalities=["AUDIO"],
            speech_config=types.SpeechConfig(
                voice_config=types.VoiceConfig(
                    prebuilt_voice_config=types.PrebuiltVoiceConfig(
                        voice_name=voice,
                    )
                ),
                language_code="en-US",
            ),
            output_audio_transcription=types.AudioTranscriptionConfig(),
            input_audio_transcription=types.AudioTranscriptionConfig(),
        )
    else:
        # Live coaching — text-only output (silent overlay for the dashboard)
        return RunConfig(
            response_modalities=["TEXT"],
            input_audio_transcription=types.AudioTranscriptionConfig(),
        )


# ---------------------------------------------------------------------------
# WebSocket endpoint — bidirectional streaming via Gemini Live API
# ---------------------------------------------------------------------------
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    """Main WebSocket endpoint for live coaching sessions.

    Client → Server messages
    ────────────────────────
    {"type":"config","mode":"live"|"practice","voice":"...","persona":"..."}
    {"type":"audio","data":"<base64 16-bit PCM 16 kHz mono>"}
    {"type":"image","data":"<base64 JPEG>","mimeType":"image/jpeg"}
    {"type":"text","text":"..."}
    {"type":"end"}

    Server → Client messages
    ────────────────────────
    {"type":"audio","data":"<base64 24 kHz PCM>"}          # practice mode
    {"type":"text","text":"..."}                            # text response
    {"type":"transcript","text":"...","source":"input"|"output","partial":bool}
    {"type":"tool_call","name":"...","args":{...}}          # dashboard updates
    {"type":"tool_result","name":"...","data":{...}}        # tool return values
    {"type":"turn_complete"}
    {"type":"status","message":"..."}
    {"type":"error","message":"..."}
    """
    await websocket.accept()
    print("Client connected")

    # ── Phase 1: Wait for config message to determine mode + agent ─────
    mode = "live"
    persona_id = "sarah-startup"
    voice = COACH_VOICE

    try:
        raw = await asyncio.wait_for(websocket.receive_text(), timeout=30)
        msg = json.loads(raw)
        if msg.get("type") == "config":
            mode = msg.get("mode", "live")
            persona_id = msg.get("persona", "sarah-startup")
            voice = msg.get("voice", COACH_VOICE)
    except (asyncio.TimeoutError, WebSocketDisconnect):
        pass  # Use defaults

    # Select agent + runner based on mode
    if mode == "practice":
        practice_agent = create_practice_agent(persona_id)
        active_runner = Runner(
            agent=practice_agent,
            app_name="live_sales_coach",
            session_service=session_service,
        )
        from app.prompts.personas import PERSONAS
        persona = PERSONAS.get(persona_id, {})
        voice = persona.get("voice", voice)
    else:
        active_runner = live_runner

    run_config = _build_run_config(mode, voice)

    # Create a unique session
    session = await session_service.create_session(
        app_name="live_sales_coach",
        user_id="user_1",
    )

    await websocket.send_json({
        "type": "status",
        "message": f"Session started: mode={mode}" + (
            f", persona={persona_id}" if mode == "practice" else ""
        ),
    })

    # Live request queue — the bridge between client audio and the ADK agent
    live_queue = LiveRequestQueue()

    # ── Phase 2: Bidirectional streaming ───────────────────────────────

    async def forward_events():
        """Read events from runner.run_live() and push to the client."""
        try:
            async for event in active_runner.run_live(
                user_id="user_1",
                session_id=session.id,
                live_request_queue=live_queue,
                run_config=run_config,
            ):
                try:
                    await _handle_event(websocket, event)
                except WebSocketDisconnect:
                    break
                except Exception:
                    break
        except Exception as exc:
            print(f"run_live error: {exc}")
            traceback.print_exc()
            try:
                await websocket.send_json(
                    {"type": "error", "message": str(exc)}
                )
            except Exception:
                pass

    async def read_client():
        """Read messages from the client and push to the live queue."""
        try:
            while True:
                raw = await websocket.receive_text()
                msg = json.loads(raw)
                msg_type = msg.get("type")

                if msg_type == "end":
                    # Request a call summary before closing (live mode)
                    if mode == "live":
                        live_queue.send_content(
                            types.Content(
                                role="user",
                                parts=[types.Part(
                                    text="The call has ended. Please call save_call_summary() "
                                    "with the complete call analysis."
                                )],
                            )
                        )
                        await asyncio.sleep(5)  # Give the agent time to respond
                    live_queue.close()
                    break

                elif msg_type == "audio":
                    audio_bytes = base64.b64decode(msg["data"])
                    live_queue.send_realtime(
                        types.Blob(
                            data=audio_bytes,
                            mime_type="audio/pcm",
                        )
                    )

                elif msg_type == "image":
                    image_bytes = base64.b64decode(msg["data"])
                    mime = msg.get("mimeType", "image/jpeg")
                    live_queue.send_content(
                        types.Content(
                            role="user",
                            parts=[
                                types.Part(
                                    inline_data=types.Blob(
                                        data=image_bytes,
                                        mime_type=mime,
                                    )
                                )
                            ],
                        )
                    )

                elif msg_type == "text":
                    live_queue.send_content(
                        types.Content(
                            role="user",
                            parts=[types.Part(text=msg["text"])],
                        )
                    )

        except WebSocketDisconnect:
            live_queue.close()
        except Exception as exc:
            print(f"read_client error: {exc}")
            traceback.print_exc()
            live_queue.close()

    # ── Run both tasks concurrently ────────────────────────────────────
    try:
        await asyncio.gather(forward_events(), read_client())
    except Exception as exc:
        print(f"Session error: {exc}")
    finally:
        print(f"Session ended (mode={mode}, session_id={session.id})")


# ---------------------------------------------------------------------------
# Event handler — converts ADK events to WebSocket messages
# ---------------------------------------------------------------------------
async def _handle_event(ws: WebSocket, event) -> None:
    """Translate a single ADK Event into WebSocket JSON messages."""

    # ── Audio output (practice mode) ──────────────────────────────────
    if event.content and event.content.parts:
        for part in event.content.parts:
            # Inline audio blob → base64 encode and send to client
            if hasattr(part, "inline_data") and part.inline_data:
                blob = part.inline_data
                if blob.data and blob.mime_type and "audio" in blob.mime_type:
                    await ws.send_json(
                        {
                            "type": "audio",
                            "data": base64.b64encode(blob.data).decode(),
                            "mimeType": blob.mime_type,
                        }
                    )

            # Text response
            if part.text:
                await ws.send_json(
                    {
                        "type": "text",
                        "text": part.text,
                    }
                )

    # ── Input transcription (what the user/rep said) ──────────────────
    if event.input_transcription:
        await ws.send_json(
            {
                "type": "transcript",
                "text": event.input_transcription.text or "",
                "source": "input",
                "partial": getattr(event, "partial", False) or False,
            }
        )

    # ── Output transcription (what the model said) ────────────────────
    if event.output_transcription:
        await ws.send_json(
            {
                "type": "transcript",
                "text": event.output_transcription.text or "",
                "source": "output",
                "partial": getattr(event, "partial", False) or False,
            }
        )

    # ── Tool calls (dashboard updates, objections, etc.) ──────────────
    if event.actions:
        if event.actions.tool_calls:
            for tc in event.actions.tool_calls:
                await ws.send_json(
                    {
                        "type": "tool_call",
                        "name": tc.name,
                        "args": tc.args if isinstance(tc.args, dict) else {},
                    }
                )

        if event.actions.tool_results:
            for tr in event.actions.tool_results:
                # Extract the dict from the FunctionResponse
                result_data = tr
                if hasattr(tr, "response"):
                    result_data = tr.response
                elif hasattr(tr, "result"):
                    result_data = tr.result

                await ws.send_json(
                    {
                        "type": "tool_result",
                        "data": result_data
                        if isinstance(result_data, dict)
                        else str(result_data),
                    }
                )

    # ── Turn complete ─────────────────────────────────────────────────
    if getattr(event, "turn_complete", False):
        await ws.send_json({"type": "turn_complete"})

    # ── Usage metadata (for cost tracking) ────────────────────────────
    if event.usage_metadata:
        meta = event.usage_metadata
        await ws.send_json(
            {
                "type": "usage",
                "prompt_tokens": getattr(meta, "prompt_token_count", 0) or 0,
                "candidates_tokens": getattr(meta, "candidates_token_count", 0)
                or 0,
                "total_tokens": getattr(meta, "total_token_count", 0) or 0,
            }
        )


# ---------------------------------------------------------------------------
# Entry point
# ---------------------------------------------------------------------------
if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host=HOST, port=PORT, reload=True)
