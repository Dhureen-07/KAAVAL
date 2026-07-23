from ml_engine.query_classifier import classify_query
from ml_engine.executor import process_query
from ml_engine.district_stats import get_district_statistics
from ml_engine.sqlite_engine import search_sqlite
from ml_engine.web_engine import search_web

def route_query(query):

    route = classify_query(query)

    print("=" * 50)
    print("QUERY ROUTE :", route)
    print("=" * 50)

    response = {
    "route": route,
    "ml_result": None,
    "district_result": None,
    "sqlite_result": None,
    "web_result": None
}

    if route == "ML":
        print("Running ML Engine...")
        response["ml_result"] = process_query(query)

    elif route == "DISTRICT":
        print("Running District Statistics Engine...")
        response["district_result"] = get_district_statistics(query)

    elif route == "WEB":
        print("Running Web Engine...")
        response["web_result"] = search_web(query)

    elif route == "SQLITE":
            print("Running SQLite Engine...")
            response["sqlite_result"] = search_sqlite(query)
    else:
        print("Irrelevant Query.")

    return response