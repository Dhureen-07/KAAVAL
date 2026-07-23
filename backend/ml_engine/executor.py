from ml_engine.reasoning.planner import execute_plan


def process_query(query: str):

    result = execute_plan(query)

    return result


if __name__ == "__main__":

    tests = [
        "Chain snatching in Mysuru",
        "Cyber crime in Bengaluru 2024",
        "Temple theft",
        "How can I stay safe online?",
    ]

    for q in tests:
        print("=" * 80)
        print(process_query(q))