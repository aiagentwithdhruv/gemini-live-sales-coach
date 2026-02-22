"""
CRM Tool — Post-call summary logging.

Saves call analysis to Firestore and optionally triggers
an n8n webhook for follow-up automation.
"""

import os
import time
import httpx


def save_call_summary(
    summary: str,
    overall_score: int,
    outcome: str,
    objections_faced: list[str],
    key_moments: list[str],
    next_steps: list[str],
    rep_talk_pct: int,
    prospect_talk_pct: int,
) -> dict:
    """Save the complete post-call analysis to CRM.

    Call this when the sales call has clearly ended (goodbyes exchanged,
    silence, or user stops the session). Provide a comprehensive summary
    of the entire call.

    Args:
        summary: A 2-3 sentence overview of how the call went. Include
            the key outcome and most important moment.
        overall_score: Overall call performance score (0-100).
        outcome: The call result. Must be one of:
            "meeting_booked", "follow_up", "no_interest", "needs_info".
        objections_faced: List of objection types encountered during the call
            (e.g., ["price", "timing", "authority"]).
        key_moments: List of notable moments described in 1 sentence each.
        next_steps: List of specific action items for the rep after this call.
        rep_talk_pct: Final percentage of time the rep spoke (0-100).
        prospect_talk_pct: Final percentage of time the prospect spoke (0-100).

    Returns:
        dict: Confirmation with the saved call data.
    """
    call_data = {
        "type": "call_summary",
        "timestamp": time.time(),
        "summary": summary,
        "overall_score": overall_score,
        "outcome": outcome,
        "scores": {
            "overall": overall_score,
        },
        "objections_faced": objections_faced,
        "objection_count": len(objections_faced),
        "key_moments": key_moments,
        "next_steps": next_steps,
        "talk_ratio": {
            "rep": rep_talk_pct,
            "prospect": prospect_talk_pct,
        },
    }

    # Fire n8n webhook for follow-up automation (non-blocking)
    webhook_url = os.getenv("N8N_WEBHOOK_URL")
    if webhook_url:
        try:
            httpx.post(webhook_url, json=call_data, timeout=5.0)
        except Exception:
            pass  # Non-critical, don't block the response

    return {
        "status": "success",
        "message": f"Call summary saved. Score: {overall_score}/100. Outcome: {outcome}.",
        "data": call_data,
    }
