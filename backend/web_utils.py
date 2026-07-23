import urllib.request
import urllib.parse
import re


def perform_web_search(query_str, max_results=3):
    """
    100% Free Web Search fallback using DuckDuckGo HTML parser.
    Requires ZERO API keys or paid subscriptions.
    """
    print(f"Executing Web Search Fallback for: '{query_str}'...")
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
    
    encoded_query = urllib.parse.quote_plus(query_str)
    url = f"https://html.duckduckgo.com/html/?q={encoded_query}"
    
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=5) as response:
            html = response.read().decode('utf-8', errors='ignore')
            
            # Simple regex to extract search snippet text
            results = []

            matches = re.findall(r'<a class="result__snippet[^>]*>(.*?)</a>', html, re.DOTALL)

            for m in matches[:max_results]:
                clean_text = re.sub(r'<[^>]+>', '', m).strip()

                if clean_text:
                    results.append({
                        "snippet": clean_text
                    })

            if results:
                return results, None
            else:
                return [], "No web snippets parsed"
                    
           
    except Exception as e:
        print(f"Web search error: {e}")
        return [], str(e)
