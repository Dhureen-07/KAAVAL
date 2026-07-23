from database import search_resources


def search_sqlite(query):

    matches = search_resources(query, limit=5)

    if not matches:
        return {
            "found": False,
            "matches": []
        }

    return {
        "found": True,
        "matches": matches
    }