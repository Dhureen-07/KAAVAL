import re

from ml_engine.resources import (
    CRIME_TYPES,
    DISTRICTS,
    DISTRICT_ALIASES,
)


def extract_entities(query: str):

    q = query.lower()

    entities = {
        "crime": None,
        "district": None,
        "year": None,
    }

    # District aliases
    for alias, actual in DISTRICT_ALIASES.items():
        if alias in q:
            entities["district"] = actual
            break

    # Dataset districts
    if entities["district"] is None:
        for district in DISTRICTS:
            if district in q:
                entities["district"] = district.title()
                break

    # Crime
    for crime in CRIME_TYPES:
        pattern = rf"\b{re.escape(crime)}\b"
        if re.search(pattern, q):
            entities["crime"] = crime
            break

    # Year
    year = re.search(r"\b20\d{2}\b", q)

    if year:
        entities["year"] = int(year.group())

    return entities


if __name__ == "__main__":

    tests = [
        "Chain snatching in Mysuru",
        "Murder in Hassan 2024",
        "Cyber crime in Bengaluru",
        "Temple theft",
        "How can I stay safe online?"
    ]

    for t in tests:
        print(t)
        print(extract_entities(t))
        print("-" * 40)