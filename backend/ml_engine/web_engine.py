from web_utils import perform_web_search


def search_web(query):
    """
    Web Engine wrapper around DuckDuckGo search.
    """

    snippets, error = perform_web_search(query, max_results=3)

    if snippets:
        return {
            "found": True,
            "results": snippets,
            "error": None
        }

    return {
        "found": False,
        "results": [],
        "error": error
    }