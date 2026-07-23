import os
import json
import urllib.request
import urllib.parse
import re

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY", "")
OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions"
REASONING_MODEL = os.getenv("REASONING_MODEL", "meta-llama/llama-3.2-3b-instruct:free")
HF_TOKEN = os.getenv("HF_TOKEN", "")
HF_MODELS = [
    "meta-llama/Llama-3.2-3B-Instruct",
    "Qwen/Qwen2.5-7B-Instruct",
    "mistralai/Mistral-7B-Instruct-v0.3"
]

SYSTEM_PROMPT = """
You are **KAAVAL AI**, the official Intelligence Assistant for the Karnataka State Police (KSP).
Your mission is to assist officers by retrieving verified crime statistics, legal sections (IPC/BNS), emergency resource contacts, and general criminal intelligence.

Instructions:
1. Provide accurate, clear, and direct answers to the user's inquiry.
2. Structure your answer professionally using clear Markdown formatting:
   - ## Summary
   - ## Primary Findings
   - ## Additional Intelligence & Sources
3. Use the supplied Database Context and Web Search Results to provide full, complete answers.
"""

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
            
            snippets = []
            matches = re.findall(r'<a class="result__snippet[^>]*>(.*?)</a>', html, re.DOTALL)
            for m in matches[:max_results]:
                clean_text = re.sub(r'<[^>]+>', '', m).strip()
                if clean_text:
                    snippets.append(clean_text)
                    
            if snippets:
                return snippets, None
            else:
                return [], "No web snippets parsed"
    except Exception as e:
        print(f"Web search error: {e}")
        return [], str(e)

def query_huggingface_llm(prompt, system_instruction=SYSTEM_PROMPT):
    """
    Query Hugging Face Inference API for text generation using free open-source models.
    """
    if not HF_TOKEN:
        return None, "HF_TOKEN missing"

    for model_id in HF_MODELS:
        url = f"https://api-inference.huggingface.co/models/{model_id}"
        headers = {
            'Authorization': f'Bearer {HF_TOKEN}',
            'Content-Type': 'application/json'
        }
        
        full_prompt = f"System: {system_instruction}\n\nUser: {prompt}\n\nAssistant:"
        payload = {
            "inputs": full_prompt,
            "parameters": {
                "max_new_tokens": 512,
                "temperature": 0.3,
                "return_full_text": False
            }
        }
        
        try:
            req = urllib.request.Request(url, data=json.dumps(payload).encode('utf-8'), headers=headers, method='POST')
            with urllib.request.urlopen(req, timeout=10) as response:
                result = json.loads(response.read().decode('utf-8'))
                
                if isinstance(result, list) and len(result) > 0:
                    text = result[0].get("generated_text", "")
                    if text:
                        return text.strip(), f"HuggingFace ({model_id})"
                elif isinstance(result, dict) and "generated_text" in result:
                    return result["generated_text"].strip(), f"HuggingFace ({model_id})"
        except Exception as e:
            print(f"Hugging Face model {model_id} error: {e}")
            continue

    return None, "All Hugging Face models failed or were unavailable"

def query_openrouter(prompt, system_context=""):
    headers = {
        'Content-Type': 'application/json',
        'Authorization': f'Bearer {OPENROUTER_API_KEY}',
        'HTTP-Referer': 'http://localhost:3000',
        'X-Title': 'KAAVAL AI'
    }
    
    sys_prompt = SYSTEM_PROMPT
    if system_context:
        sys_prompt += f"\n\n[ADDITIONAL CONTEXT & SEARCH RESULTS]\n{system_context}"
        
    data = {
        "model": REASONING_MODEL,
        "messages": [
            {"role": "system", "content": sys_prompt},
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.3
    }
    
    try:
        req = urllib.request.Request(OPENROUTER_API_URL, data=json.dumps(data).encode('utf-8'), headers=headers, method='POST')
        with urllib.request.urlopen(req, timeout=12) as response:
            result = json.loads(response.read().decode('utf-8'))
            if 'choices' in result and len(result['choices']) > 0:
                text_response = result['choices'][0]['message']['content']
                return text_response, "OpenRouter LLM Engine"
    except Exception as e:
        print(f"OpenRouter API Error: {e}")
        
    return None, "OpenRouter API unavailable"

def execute_ml_query(query: str, context_str: str = ""):
    """
    Main entry point for ML Inference queries.
    Tries HF first, then OpenRouter.
    """
    final_response = None
    llm_source = None
    
    if HF_TOKEN:
        print("Querying Hugging Face LLM models...")
        hf_prompt = f"Question: {query}\n\nContext Information:\n{context_str}"
        final_response, llm_source = query_huggingface_llm(hf_prompt)
            
    if not final_response and OPENROUTER_API_KEY:
        print("Querying OpenRouter LLM model...")
        final_response, llm_source = query_openrouter(query, system_context=context_str)
        
    return final_response, llm_source
