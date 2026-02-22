"""
Coaching Tips Tool — Curated coaching advice based on call context.

Provides structured coaching responses using proven sales frameworks.
"""

from app.prompts.objections import OBJECTION_CATEGORIES, get_objection_framework


def get_coaching_tip(
    situation: str,
    tip_type: str = "general",
) -> dict:
    """Get a curated coaching tip for a specific situation.

    Call this when you need to provide structured coaching advice
    based on what's happening in the call. Use the response to
    update the dashboard with actionable tips.

    Args:
        situation: Brief description of what's happening in the call.
            Examples: "prospect went silent after pricing discussion",
            "rep is rambling about features", "prospect asked about competitors".
        tip_type: Type of coaching needed. One of:
            "objection" - handling a specific objection
            "discovery" - improving qualifying questions
            "rapport" - building trust and connection
            "closing" - moving toward next steps
            "general" - tactical advice for the situation

    Returns:
        dict: Coaching tip with framework reference and exact phrases.
    """
    frameworks = {
        "objection": {
            "method": "Acknowledge > Reframe > Question (Sandler)",
            "template": (
                '1. Acknowledge: "I completely understand that concern..."\n'
                '2. Reframe: "What we\'re actually seeing with companies like yours..."\n'
                '3. Question: "What would it mean for your team if...?"'
            ),
        },
        "discovery": {
            "method": "SPIN Selling (Situation > Problem > Implication > Need-Payoff)",
            "template": (
                "Ask about their SITUATION first, then dig into the PROBLEM.\n"
                'Try: "Walk me through how your team currently handles [X]?"\n'
                'Then: "What happens when [problem] occurs?"'
            ),
        },
        "rapport": {
            "method": "Challenger Sale (Teach > Tailor > Take Control)",
            "template": (
                "Share an insight they don't know about their own industry.\n"
                'Try: "Most [industry] companies we talk to are surprised to learn..."\n'
                "Then connect it to their specific situation."
            ),
        },
        "closing": {
            "method": "MEDDIC (Metrics > Economic Buyer > Decision Criteria)",
            "template": (
                "Establish clear next steps with a specific date and time.\n"
                'Try: "Based on what we discussed, I think a 30-minute deep dive would be valuable. '
                'Does Thursday at 2pm work?"\n'
                "Always get a commitment, even if it's small."
            ),
        },
        "general": {
            "method": "Tactical Sales Coaching",
            "template": (
                "Lead with value, not features.\n"
                "Ask more questions than you make statements.\n"
                "Mirror the prospect's energy and pace."
            ),
        },
    }

    framework = frameworks.get(tip_type, frameworks["general"])

    return {
        "status": "success",
        "situation": situation,
        "framework": framework["method"],
        "coaching_tip": framework["template"],
        "message": f"Coaching tip generated for: {situation[:50]}",
    }
