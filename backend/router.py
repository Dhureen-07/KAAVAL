import datetime
from query_classifier import classify_query, QueryIntent
from engines.ml_engine import execute_ml_query, perform_web_search
from engines.district_engine import execute_district_query
from engines.sqlite_engine import execute_sqlite_query
from response_generator import generate_markdown_response
from database import save_chat_log

def route_query(query: str):
    """
    Orchestrator: Takes a user query, classifies it, routes to the appropriate engine,
    formats the response, logs it, and returns the API payload.
    """
    print(f"\n[ROUTER] Processing AI query: '{query}'")
    
    # 1. Classification
    intent = classify_query(query)
    print(f"[ROUTER] Classified intent: {intent.name}")
    
    sources = []
    final_response_text = ""
    context_str = ""
    
    # 2. Routing & Execution
    if intent == QueryIntent.DISTRICT_STATS:
        results, source = execute_district_query(query)
        sources.append(source)
        final_response_text = generate_markdown_response(query, intent.value, results, source)
        
    elif intent == QueryIntent.SQLITE_SEARCH:
        db_matches, source = execute_sqlite_query(query)
        
        # Fallback to ML/Web if DB fails to find anything useful
        if not db_matches:
            print("[ROUTER] SQLite returned empty. Escalating to ML Engine...")
            web_snippets, web_err = perform_web_search(query, max_results=3)
            if web_snippets:
                sources.append("DuckDuckGo Web Search")
                context_str = "\nLIVE WEB SEARCH RESULTS:\n" + "\n".join(web_snippets)
                
            ml_response, ml_source = execute_ml_query(query, context_str)
            if ml_response:
                sources.append(ml_source)
                final_response_text = ml_response
            else:
                final_response_text = generate_markdown_response(query, "sqlite_search", [], source)
        else:
            sources.append(source)
            final_response_text = generate_markdown_response(query, intent.value, db_matches, source)
            
    elif intent == QueryIntent.ML_INFERENCE:
        # Pre-fetch some DB context just in case
        db_matches, _ = execute_sqlite_query(query, limit=2)
        if db_matches:
            context_str += "LOCAL DATABASE RECORDS:\n"
            for res in db_matches:
                context_str += f"- [{res['category']}] {res['title']}: {res['content']}\n"
                
        # Also pre-fetch web context if it looks like a general query
        web_snippets, web_err = perform_web_search(query, max_results=2)
        if web_snippets:
            context_str += "\nLIVE WEB SEARCH RESULTS:\n" + "\n".join(web_snippets)
            sources.append("DuckDuckGo Web Search")
            
        ml_response, ml_source = execute_ml_query(query, context_str)
        if ml_response:
            sources.append(ml_source)
            final_response_text = ml_response
        else:
            # Absolute fallback
            sources.append("KAAVAL Local Synthesis Engine")
            final_response_text = generate_markdown_response(query, intent.value, db_matches or web_snippets or ["No results"], "Synthesis")

    # 3. Post-processing & Logging
    confidence = min(0.99, max(0.85, 0.88 + (len(final_response_text) / 2000.0)))
    save_chat_log(query, final_response_text, sources)
    
    return {
        "response": final_response_text,
        "confidence_score": confidence,
        "sources": sources,
        "timestamp": datetime.datetime.now().isoformat()
    }
