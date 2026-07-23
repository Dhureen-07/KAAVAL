from ml_engine.reasoning.entities import extract_entities
from ml_engine.inference import find_similar_crimes


def execute_plan(query: str):

    entities = extract_entities(query)

    result = {
        "query": query,
        "entities": entities,
        "evidence": None,
    }

    # Use similarity search if a crime is detected
    if entities["crime"]:
        result["evidence"] = find_similar_crimes(query)

    return result


if __name__ == "__main__":

    tests = [
        "Chain snatching in Mysuru",
        "Cyber crime in Bengaluru 2024",
        "Temple theft",
    ]

    for t in tests:
        print("=" * 70)
        print(execute_plan(t))