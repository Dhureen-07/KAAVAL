def generate_markdown_response(query: str, intent: str, results: any, source: str) -> str:
    """
    Standardizes the intelligence output from various engines into the KAAVAL UI Markdown format.
    """
    response = f"## Summary\nIntelligence gathered for **'{query}'** via `{intent}` routing.\n\n## Primary Findings\n"
    
    if intent == "district_stats":
        response += "### 📍 Live District Telemetry:\n"
        for d in results:
            response += f"- **{d['name']}** [Severity: {d['severity']}]\n  Active FIRs: {d['active_firs']} | Notes: {d['notes']}\n"
            
    elif intent == "sqlite_search":
        if results:
            response += "### 🗄️ Database Records (`kaaval.db`):\n"
            for m in results:
                response += f"* **{m['title']}**: {m['content']}\n"
        else:
            response += "No direct matches found in local databases.\n"
            
    elif intent == "ml_inference":
        if isinstance(results, str):
            # ML engine returns the raw generated string, which usually has its own markdown
            return results
        else:
            response += "### 🌐 Synthesized Intelligence:\n"
            for item in results:
                response += f"* {item}\n"
                
    response += f"\n\n## Additional Intelligence & Sources\nVerified cross-references matched from **{source}**."
    return response
