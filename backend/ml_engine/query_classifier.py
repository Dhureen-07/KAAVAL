# ml_engine/query_classifier.py

CRIME_KEYWORDS = [
    "crime",
    "murder",
    "theft",
    "robbery",
    "snatching",
    "chain snatching",
    "assault",
    "burglary",
    "fraud",
    "cyber",
    "cyber crime",
    "kidnap",
    "kidnapping",
    "rape",
    "violence",
    "vehicle theft",
    "drugs",
    "narcotics",
    "analysis",
    "predict",
    "prediction",
    "pattern",
    "hotspot"
]

WEB_KEYWORDS = [
    # News
    "latest",
    "recent",
    "today",
    "yesterday",
    "news",
    "breaking",
    "current",
    "live",

    # Police Services
    "helpline",
    "hotline",
    "contact",
    "phone",
    "number",
    "website",
    "portal",
    "online",
    "complaint",
    "report",
    "register",
    "emergency",

    # Recruitment
    "recruitment",
    "vacancy",
    "vacancies",
    "job",
    "jobs",
    "career",
    "apply",
    "application",
    "notification",
    "exam",
    "result",
    "constable",
    "sub inspector",
    "si",

    # General Police
    "karnataka police",
    "traffic police",
    "police station",
    "headquarters"
]

LEGAL_KEYWORDS = [
    "ipc",
    "bns",
    "section",
    "law",
    "legal",
    "fir",
    "punishment",
    "fine",
    "imprisonment",
    "act",
    "bail",
    "offence",
    "offense"
]

DISTRICT_KEYWORDS = [
    "statistics",
    "stats",
    "district",
    "crime rate",
    "highest",
    "lowest",
    "compare",
    "comparison",
    "increase",
    "decrease",
    "total cases"
]


def classify_query(query: str) -> str:

    q = query.lower()

    scores = {
        "ML": 0,
        "WEB": 0,
        "SQLITE": 0,
        "DISTRICT": 0
    }

    # ML
    for word in CRIME_KEYWORDS:
        if word in q:
            scores["ML"] += 1

    # WEB
    for word in WEB_KEYWORDS:
        if word in q:
            scores["WEB"] += 1

    # SQLITE
    for word in LEGAL_KEYWORDS:
        if word in q:
            scores["SQLITE"] += 1

    # DISTRICT
    for word in DISTRICT_KEYWORDS:
        if word in q:
            scores["DISTRICT"] += 1

    # Special handling for crime trends/statistics
    if "trend" in q:
        scores["ML"] += 2

    if "analysis" in q:
        scores["ML"] += 2

    if "district" in q:
        scores["DISTRICT"] += 2

    if "latest" in q or "news" in q:
        scores["WEB"] += 2

    if "ipc" in q or "bns" in q or "section" in q:
        scores["SQLITE"] += 3

    best_route = max(scores, key=scores.get)

    if scores[best_route] == 0:
        return "IRRELEVANT"

    return best_route