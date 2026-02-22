"""
Live Sales Coach — ADK Agent Definitions

Two agents for two modes:
  1. live_sales_coach  — Silent observer during real calls (TEXT mode)
  2. practice_prospect — AI buyer for role-play practice (AUDIO mode)
"""

from google.adk.agents import Agent
from google.adk.tools import google_search

from app.config import LIVE_MODEL, STANDARD_MODEL
from app.prompts.coach_system import COACH_SYSTEM_PROMPT
from app.prompts.personas import PERSONAS, get_persona_prompt
from app.tools.dashboard import update_dashboard, log_objection
from app.tools.prospect import search_prospect_info
from app.tools.crm import save_call_summary
from app.tools.coaching import get_coaching_tip


# ---------------------------------------------------------------------------
# Agent 1: Live Sales Coach (for real calls — TEXT output)
# ---------------------------------------------------------------------------
root_agent = Agent(
    name="live_sales_coach",
    model=LIVE_MODEL,
    description=(
        "Real-time AI sales coach that listens to live sales calls, "
        "analyzes conversations, detects objections, tracks sentiment, "
        "and provides coaching tips through a dashboard interface."
    ),
    instruction=COACH_SYSTEM_PROMPT,
    tools=[
        update_dashboard,
        log_objection,
        search_prospect_info,
        save_call_summary,
        get_coaching_tip,
        google_search,
    ],
)


# ---------------------------------------------------------------------------
# Agent 2: Practice Prospect (for training — AUDIO output)
# ---------------------------------------------------------------------------
PRACTICE_AGENT_INSTRUCTION = """You have TWO simultaneous roles in this practice session:

ROLE 1 — THE PROSPECT (your PRIMARY role):
You are role-playing as a real buyer on a sales call. Stay FULLY in character.
Respond with natural speech — short, realistic, with personality.
{persona_prompt}

ROLE 2 — THE HIDDEN COACH (secondary, via tool calls ONLY):
While playing the prospect, you ALSO silently coach the salesperson through tool calls.
After EVERY exchange, call update_dashboard() with:
- A coaching_tip (what the rep did well or should improve)
- Updated scores if applicable (discovery, rapport, objection, next_steps)
- Current sentiment (how the "prospect" is feeling)
- rep_talk_pct estimate

When the prospect raises an objection, ALSO call log_objection() with:
- The objection_type (price/timing/authority/need/trust/competitor/contract/custom)
- The exact objection_text the prospect said
- A suggested_response for the rep to handle it

CRITICAL RULES:
- Your SPOKEN words must be 100% in-character as the prospect
- Coaching ONLY happens through tool calls — NEVER break character in speech
- Tool calls should happen BETWEEN speaking turns, not during
- Be a realistic, challenging prospect — do NOT make it easy
- Use short, natural responses — real prospects don't give speeches
"""


def create_practice_agent(persona_id: str = "sarah-startup") -> Agent:
    """Create a practice prospect agent for a specific persona."""
    persona_prompt = get_persona_prompt(persona_id)
    if not persona_prompt:
        persona_prompt = get_persona_prompt("sarah-startup")

    persona = PERSONAS.get(persona_id, PERSONAS["sarah-startup"])

    instruction = PRACTICE_AGENT_INSTRUCTION.format(
        persona_prompt=persona_prompt,
    )

    return Agent(
        name="practice_prospect",
        model=LIVE_MODEL,
        description=(
            f"AI practice prospect: {persona['name']}, {persona['title']} "
            f"at {persona['company']}. Difficulty: {persona['difficulty']}."
        ),
        instruction=instruction,
        tools=[
            update_dashboard,
            log_objection,
            get_coaching_tip,
        ],
    )
