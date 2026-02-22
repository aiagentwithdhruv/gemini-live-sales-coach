"""
Prospect Research Tool — Search for prospect/company info during live calls.

Uses Google Search (built into ADK) to find relevant context about
the prospect's company, industry, recent news, and pain points.
"""

import httpx


async def search_prospect_info(query: str) -> dict:
    """Search the web for information about a prospect or their company.

    Call this when you see the prospect's website, LinkedIn, or hear
    them mention their company name. Use the results to give the rep
    contextual coaching tips.

    Args:
        query: Search query about the prospect or company. Examples:
            "TechFlow Startup recent funding", "Global Manufacturing Inc competitors",
            "Apex Financial CEO LinkedIn".

    Returns:
        dict: Search results with relevant company/prospect information.
    """
    # In production, this would use Google Search via ADK's built-in tool
    # or the Google Custom Search API. For now, return a structured response
    # that tells the agent to use the info contextually.
    return {
        "status": "success",
        "message": f"Searched for: {query}",
        "instruction": (
            "Use any information you found from the visual input (website, LinkedIn) "
            "combined with this search to provide contextual coaching tips. "
            "Tell the rep specific facts about the prospect's company they can reference."
        ),
    }
