from enum import Enum
import re

class QueryIntent(Enum):
    DISTRICT_STATS = "district_stats"
    SQLITE_SEARCH = "sqlite_search"
    ML_INFERENCE = "ml_inference"

def classify_query(query: str) -> QueryIntent:
    """
    Classify the incoming query to determine the best execution route.
    """
    query_lower = query.lower()
    
    # 1. Check for district or statistical intent
    district_keywords = ["district", "bangalore", "mysuru", "hubballi", "stats", "statistics", "severity", "deployment", "active units"]
    if any(re.search(rf"\b{kw}\b", query_lower) for kw in district_keywords):
        # Additional check to ensure it's not a generic query that just mentions a city
        if any(w in query_lower for w in ["how many", "status", "report", "severity"]):
            return QueryIntent.DISTRICT_STATS

    # 2. Check for general ML or web-search heavy queries
    ml_keywords = ["latest", "news", "what is", "how to", "who is", "help", "contact", "number", "india", "law", "police", "explain", "summarize"]
    if any(re.search(rf"\b{kw}\b", query_lower) for kw in ml_keywords) or len(query_lower.split()) > 10:
        return QueryIntent.ML_INFERENCE
        
    # 3. Default to SQLite Search (fast, local retrieval for BNS/IPC sections, existing cases, etc.)
    return QueryIntent.SQLITE_SEARCH
