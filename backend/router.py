import datetime
from typing import List, Dict

from query_classifier import classify_query, QueryIntent
from engines.ml_engine import execute_ml_query, perform_web_search
from engines.district_engine import execute_district_query
from engines.sqlite_engine import execute_sqlite_query
from response_generator import generate_markdown_response
from database import save_chat_log

# Simple in-memory session history
SESSION_MEMORY: List[Dict[str, str]] = []


def route_query(query: str) -> Dict:
    print(f"\n[ROUTER] Processing AI query: '{query}'")

    intent = classify_query(query)
    print(f"[ROUTER] Classified intent: {intent.name}")

    sources = []
    final_response = None
    final_response_text = ""
    context_str = ""

    # ---------------- DISTRICT ----------------
    if intent == QueryIntent.DISTRICT_STATS:

        results, source = execute_district_query(query)

        sources.append(source)

        final_response_text = generate_markdown_response(
            query,
            intent.value,
            results,
            source
        )

    # ---------------- SQLITE ----------------
    elif intent == QueryIntent.SQLITE_SEARCH:

        db_matches, source = execute_sqlite_query(query)

        if not db_matches:

            print("[ROUTER] SQLite returned empty. Escalating to ML Engine...")

            web_snippets, web_err = perform_web_search(query, max_results=3)

            if web_snippets:
                sources.append("DuckDuckGo Web Search")
                context_str = (
                    "\nLIVE WEB SEARCH RESULTS:\n"
                    + "\n".join(web_snippets)
                )

            ml_response, ml_source = execute_ml_query(
                query,
                context_str,
                conversation_history=SESSION_MEMORY
            )

            if ml_response:

                final_response = ml_response
                final_response_text = ml_response.get("response", "")

                sources.append(ml_source)

            else:

                final_response_text = generate_markdown_response(
                    query,
                    "sqlite_search",
                    [],
                    source
                )

        else:

            context_str = "LOCAL DATABASE RECORDS:\n"

            for res in db_matches:
                context_str += (
                    f"- [{res['category']}] "
                    f"{res['title']}: "
                    f"{res['content']}\n"
                )

            print(
                f"[ROUTER] Found {len(db_matches)} SQLite records. "
                "Sending to ML Engine for synthesis..."
            )

            ml_response, ml_source = execute_ml_query(
                query,
                context_str,
                conversation_history=SESSION_MEMORY
            )

            if ml_response:

                final_response = ml_response
                final_response_text = ml_response.get("response", "")

                sources.append(ml_source)
                sources.append(source)

            else:

                sources.append(source)

                final_response_text = generate_markdown_response(
                    query,
                    intent.value,
                    db_matches,
                    source
                )

    # ---------------- ML ----------------
    elif intent == QueryIntent.ML_INFERENCE:

        db_matches, _ = execute_sqlite_query(query, limit=15)

        if db_matches:

            context_str += "LOCAL DATABASE RECORDS:\n"

            for res in db_matches:

                context_str += (
                    f"- [{res['category']}] "
                    f"{res['title']}: "
                    f"{res['content']}\n"
                )

        web_snippets, web_err = perform_web_search(
            query,
            max_results=2
        )

        if web_snippets:

            context_str += (
                "\nLIVE WEB SEARCH RESULTS:\n"
                + "\n".join(web_snippets)
            )

            sources.append("DuckDuckGo Web Search")

        ml_response, ml_source = execute_ml_query(
            query,
            context_str,
            conversation_history=SESSION_MEMORY
        )

        if ml_response:

            final_response = ml_response
            final_response_text = ml_response.get("response", "")

            sources.append(ml_source)

        else:

            sources.append("KAAVAL Local Synthesis Engine")

            final_response_text = generate_markdown_response(
                query,
                intent.value,
                db_matches or web_snippets or ["No results"],
                "Synthesis"
            )

    confidence = min(
        0.99,
        max(
            0.85,
            0.88 + (len(final_response_text) / 2000.0)
        )
    )

    save_chat_log(
        query,
        final_response_text,
        sources
    )

    SESSION_MEMORY.append({
        "query": query,
        "response": final_response_text
    })

    if len(SESSION_MEMORY) > 10:
        SESSION_MEMORY.pop(0)

    payload = {
        "response": final_response_text,
        "confidence_score": confidence,
        "sources": sources,
        "timestamp": datetime.datetime.now().isoformat()
    }

    if final_response:
        payload["table"] = final_response.get("table")
        payload["chart"] = final_response.get("chart")
        payload["warnings"] = final_response.get("warnings", [])

    return payload




# import datetime
# from typing import List, Dict

# from typing import List, Dict

# from query_classifier import classify_query, QueryIntent
# from engines.ml_engine import execute_ml_query, perform_web_search
# from engines.district_engine import execute_district_query
# from engines.sqlite_engine import execute_sqlite_query
# from response_generator import generate_markdown_response
# from database import save_chat_log

# # Simple in‑memory session history (shared across requests)
# SESSION_MEMORY: List[Dict[str, str]] = []


# def route_query(query: str) -> Dict:
#     """Orchestrator: Takes a user query, classifies it, routes to the appropriate engine,
#     formats the response, logs it, and returns the API payload.
#     """
#     print(f"\n[ROUTER] Processing AI query: '{query}'")

#     # 1. Classification
#     intent = classify_query(query)
#     print(f"[ROUTER] Classified intent: {intent.name}")

#     sources = []
#     final_response_text = ""
#     context_str = ""

#     # 2. Routing & Execution
#     if intent == QueryIntent.DISTRICT_STATS:
#         results, source = execute_district_query(query)
#         sources.append(source)
#         final_response_text = generate_markdown_response(query, intent.value, results, source)

#     elif intent == QueryIntent.SQLITE_SEARCH:
#         db_matches, source = execute_sqlite_query(query)
#         if not db_matches:
#             print("[ROUTER] SQLite returned empty. Escalating to ML Engine...")
#             web_snippets, web_err = perform_web_search(query, max_results=3)
#             if web_snippets:
#                 sources.append("DuckDuckGo Web Search")
#                 context_str = "\nLIVE WEB SEARCH RESULTS:\n" + "\n".join(web_snippets)
#             ml_response, ml_source = execute_ml_query(query, context_str, conversation_history=SESSION_MEMORY)
#             if ml_response:
#                 sources.append(ml_source)
#                 final_response_text = ml_response
#             else:
#                 final_response_text = generate_markdown_response(query, "sqlite_search", [], source)
#         else:
#             # Synthesize answer using ML Engine with DB context
#             context_str = "LOCAL DATABASE RECORDS:\n"
#             for res in db_matches:
#                 context_str += f"- [{res['category']}] {res['title']}: {res['content']}\n"
#             print(f"[ROUTER] Found {len(db_matches)} SQLite records. Sending to ML Engine for synthesis...")
#             ml_response, ml_source = execute_ml_query(query, context_str, conversation_history=SESSION_MEMORY)
#             if ml_response:
#                 sources.append(ml_source)
#                 sources.append(source)
#                 final_response_text = ml_response
#             else:
#                 sources.append(source)
#                 final_response_text = generate_markdown_response(query, intent.value, db_matches, source)

#     elif intent == QueryIntent.ML_INFERENCE:
#         # Pre-fetch DB context (limit 15)
#         db_matches, _ = execute_sqlite_query(query, limit=15)
#         if db_matches:
#             context_str += "LOCAL DATABASE RECORDS:\n"
#             for res in db_matches:
#                 context_str += f"- [{res['category']}] {res['title']}: {res['content']}\n"
#         # Pre-fetch web context
#         web_snippets, web_err = perform_web_search(query, max_results=2)
#         if web_snippets:
#             context_str += "\nLIVE WEB SEARCH RESULTS:\n" + "\n".join(web_snippets)
#             sources.append("DuckDuckGo Web Search")
#         ml_response, ml_source = execute_ml_query(query, context_str, conversation_history=SESSION_MEMORY)
#         if ml_response:
#             sources.append(ml_source)
#             final_response_text = ml_response
#         else:
#             sources.append("KAAVAL Local Synthesis Engine")
#             final_response_text = generate_markdown_response(query, intent.value, db_matches or web_snippets or ["No results"], "Synthesis")

#     # 3. Post-processing & Logging
#     confidence = min(0.99, max(0.85, 0.88 + (len(final_response_text) / 2000.0)))
#     save_chat_log(query, final_response_text, sources)

#     # Update session memory (keep last 10 turns)
#     SESSION_MEMORY.append({"query": query, "response": final_response_text})
#     if len(SESSION_MEMORY) > 10:
#         SESSION_MEMORY.pop(0)

#     return {
#         "response": final_response_text,
#         "confidence_score": confidence,
#         "sources": sources,
#         "timestamp": datetime.datetime.now().isoformat()
#     }
