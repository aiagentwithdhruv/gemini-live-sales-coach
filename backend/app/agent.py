"""
Live Sales Coach — ADK Agent Definition

Root agent that listens to live sales calls via Gemini Live API
and provides real-time coaching through tool calls.
"""

from google.adk.agents import Agent
from google.adk.tools import google_search

from app.config import LIVE_MODEL
from app.prompts.coach_system import COACH_SYSTEM_PROMPT
from app.tools.dashboard import update_dashboard, log_objection
from app.tools.prospect import search_prospect_info
from app.tools.crm import save_call_summary
from app.tools.coaching import get_coaching_tip


# Root agent — the live sales coach
# This agent processes real-time audio + visual input from the sales call
# and provides coaching through tool calls that update the frontend dashboard.
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
