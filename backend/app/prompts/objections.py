"""
Objection Categories and Response Framework.
Ported from QuotaHit's objection library.
"""

OBJECTION_CATEGORIES = {
    "price": {
        "name": "Price & Budget",
        "triggers": [
            "too expensive", "budget", "cost", "can't afford", "cheaper",
            "discount", "free", "pricing", "investment", "money",
        ],
        "framework": "Reframe from cost to ROI. Ask what the cost of NOT solving the problem is.",
    },
    "timing": {
        "name": "Timing",
        "triggers": [
            "not now", "next quarter", "bad timing", "not ready", "later",
            "busy", "next year", "revisit", "not a priority right now",
        ],
        "framework": "Create urgency with the cost of delay. Ask what changes between now and then.",
    },
    "authority": {
        "name": "Authority",
        "triggers": [
            "need to ask", "my boss", "committee", "stakeholders", "decision maker",
            "board", "leadership", "manager", "sign-off", "approval",
        ],
        "framework": "Champion-build. Help them sell internally. Offer to join the next meeting.",
    },
    "need": {
        "name": "Need & Value",
        "triggers": [
            "don't need", "already have", "works fine", "not a priority",
            "happy with current", "no problem", "satisfied", "not looking",
        ],
        "framework": "Surface hidden pain. Ask about their process and find the inefficiency they've normalized.",
    },
    "trust": {
        "name": "Trust & Risk",
        "triggers": [
            "never heard of", "too small", "risky", "references", "case study",
            "proof", "guarantee", "track record", "reputation",
        ],
        "framework": "Social proof + risk reversal. Offer pilot/trial. Name similar companies.",
    },
    "competitor": {
        "name": "Competitor",
        "triggers": [
            "using", "competitor", "other options", "shopping around",
            "evaluating", "comparing", "alternative", "already have",
        ],
        "framework": "Don't trash the competitor. Ask what's working and what's not. Find the gap.",
    },
    "contract": {
        "name": "Contract & Legal",
        "triggers": [
            "locked in", "legal", "procurement", "compliance", "contract",
            "agreement", "vendor list", "preferred vendor",
        ],
        "framework": "Timeline the contract end. Start building the relationship now for the renewal window.",
    },
    "custom": {
        "name": "Custom",
        "triggers": [],
        "framework": "Acknowledge, ask clarifying questions, find the real concern underneath.",
    },
}


def detect_objection_type(text: str) -> str:
    """Detect the objection category from text."""
    text_lower = text.lower()
    for category, info in OBJECTION_CATEGORIES.items():
        if category == "custom":
            continue
        for trigger in info["triggers"]:
            if trigger in text_lower:
                return category
    return "custom"


def get_objection_framework(category: str) -> str:
    """Get the coaching framework for handling a specific objection type."""
    info = OBJECTION_CATEGORIES.get(category, OBJECTION_CATEGORIES["custom"])
    return f"{info['name']}: {info['framework']}"
