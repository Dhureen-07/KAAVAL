import urllib.request
import json

req = urllib.request.Request("https://openrouter.ai/api/v1/models")
with urllib.request.urlopen(req) as response:
    models = json.loads(response.read().decode('utf-8'))['data']
    free_models = [m['id'] for m in models if m.get('pricing', {}).get('prompt', '1') == '0' and m.get('pricing', {}).get('completion', '1') == '0']
    
    # print the first 10 free models
    print(free_models[:10])
    
    # Check if a specific free model exists
    print("Is gemini-2.0-flash-lite free?", any("gemini-2.0-flash-lite" in m for m in free_models))
    print("Is llama-3.2-3b free?", any("llama-3.2-3b" in m for m in free_models))
    print("Is llama-3.1-8b free?", any("llama-3.1-8b" in m for m in free_models))
