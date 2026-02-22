"""
Dashboard Tools — Push real-time coaching data to the frontend.

These tools are called by the Gemini agent during live sessions.
The FastAPI WebSocket handler intercepts tool responses and broadcasts
them to the connected frontend client.
"""

import time


def update_dashboard(
    coaching_tip: str,
    sentiment: str = "",
    discovery_score: int = -1,
    rapport_score: int = -1,
    objection_score: int = -1,
    next_steps_score: int = -1,
    rep_talk_pct: int = -1,
    key_moment: str = "",
    key_moment_type: str = "",
) -> dict:
    """Push real-time coaching data to the salesperson's dashboard.

    Args:
        coaching_tip: The coaching advice to display. Should be an exact phrase
            the rep can say word-for-word, or a tactical instruction.
        sentiment: Current prospect sentiment - "positive", "neutral", or "negative".
            Only include when sentiment changes significantly.
        discovery_score: How well the rep is qualifying (0-100). -1 means no update.
        rapport_score: Trust and connection score (0-100). -1 means no update.
        objection_score: How well objections are handled (0-100). -1 means no update.
        next_steps_score: Clarity of action items (0-100). -1 means no update.
        rep_talk_pct: Percentage of time the rep is talking (0-100). -1 means no update.
        key_moment: Description of a notable moment in the call.
        key_moment_type: Type of key moment - "positive", "warning", or "objection".

    Returns:
        dict: Confirmation that the dashboard update was queued.
    """
    update = {
        "type": "dashboard_update",
        "timestamp": time.time(),
        "coaching_tip": coaching_tip,
    }

    if sentiment:
        update["sentiment"] = sentiment
    if discovery_score >= 0:
        update["discovery_score"] = discovery_score
    if rapport_score >= 0:
        update["rapport_score"] = rapport_score
    if objection_score >= 0:
        update["objection_score"] = objection_score
    if next_steps_score >= 0:
        update["next_steps_score"] = next_steps_score
    if rep_talk_pct >= 0:
        update["rep_talk_pct"] = rep_talk_pct
        update["prospect_talk_pct"] = 100 - rep_talk_pct
    if key_moment:
        update["key_moment"] = {
            "text": key_moment,
            "type": key_moment_type or "positive",
            "timestamp": time.time(),
        }

    # The return value is sent back to the model AND intercepted
    # by our WebSocket handler to broadcast to the frontend
    return {
        "status": "success",
        "message": f"Dashboard updated with tip: {coaching_tip[:50]}...",
        "data": update,
    }


def log_objection(
    objection_type: str,
    objection_text: str,
    suggested_response: str,
) -> dict:
    """Log a detected objection and provide a coaching response.

    Args:
        objection_type: Category of the objection. Must be one of:
            price, timing, authority, need, trust, competitor, contract, custom.
        objection_text: What the prospect actually said, quoted verbatim.
        suggested_response: The coach's recommended response for the rep to say.
            Should use the "acknowledge > reframe > question" pattern and be
            2-3 exact sentences the rep can say word-for-word.

    Returns:
        dict: Confirmation with the logged objection data.
    """
    objection_data = {
        "type": "objection_logged",
        "timestamp": time.time(),
        "objection_type": objection_type,
        "objection_text": objection_text,
        "suggested_response": suggested_response,
    }

    return {
        "status": "success",
        "message": f"Objection logged: {objection_type} — '{objection_text[:50]}...'",
        "data": objection_data,
    }
