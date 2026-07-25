import json
import os
import re
import urllib.parse
import urllib.request
from typing import Any, Dict, List, Optional, Tuple
import json
from plotly.utils import PlotlyJSONEncoder
import pandas as pd
import plotly.express as px
from langchain_core.messages import HumanMessage, SystemMessage
from langchain_openai import ChatOpenAI

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY", "")

#


OPENROUTER_API_URL = "https://openrouter.ai/api/v1"
OPENROUTER_FREE_MODEL = os.getenv("OPENROUTER_FREE_MODEL", "openrouter/free")

SESSION_MEMORY: List[Dict[str, str]] = []



GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
GROQ_API_URL = "https://api.groq.com/openai/v1"
GROQ_FREE_MODEL = os.getenv("GROQ_FREE_MODEL", "groq/auto:free")

HF_TOKEN = os.getenv("HF_TOKEN", "")
HF_API_URL = "https://router.huggingface.co/v1"
HUGGINGFACE_FREE_MODEL = os.getenv("HUGGINGFACE_FREE_MODEL", "meta-llama/Llama-3.2-3B-Instruct")

SYSTEM_PROMPT = """
You are KAAVAL AI, the official Intelligence Assistant for Karnataka public-safety operations.

You must produce valid JSON only with this schema:
{
  "summary": "string",
  "primary_findings": ["string", "..."],
  "numeric_statistics": [{"label": "string", "value": "string"}],
  "table": {
    "title": "string",
    "columns": ["col1", "col2"],
    "rows": [["v1", "v2"], ["v3", "v4"]]
  } | null,
  "chart": {
    "required": true | false,
    "title": "string",
    "preferred_type": "bar|line|scatter|pie|area",
    "x": "column_name",
    "y": "column_name"
  },
  "additional_sources_notes": "string"
}

Rules:
- Always give complete and human-readable content.
- When data is tabular, fill "table".
- When query asks for graph/chart/trend/plot/visualization, set chart.required=true and choose suitable preferred_type.
- Do not include markdown in JSON fields except plain text values.
""".strip()

CHART_QUERY_PATTERN = re.compile(r"\b(graph|chart|plot|visual|trend|visualiz)\b", re.IGNORECASE)


def _clean_json_text(text: str) -> str:
    stripped = text.strip()
    if stripped.startswith("```"):
        stripped = re.sub(r"^```(?:json)?", "", stripped, flags=re.IGNORECASE).strip()
        stripped = re.sub(r"```$", "", stripped).strip()
    return stripped


def _safe_json_loads(text: str) -> Optional[Dict[str, Any]]:
    cleaned = _clean_json_text(text)
    try:
        parsed = json.loads(cleaned)
        return parsed if isinstance(parsed, dict) else None
    except json.JSONDecodeError:
        return None


# Global simple session memory to retain recent turns (max 10)
#


def _build_llm_clients() -> List[Tuple[str, ChatOpenAI]]:
    clients: List[Tuple[str, ChatOpenAI]] = []

    if OPENROUTER_API_KEY:
        openrouter_models = [
            os.getenv("OPENROUTER_FREE_MODEL", "google/gemma-4-31b-it:free"),
            "google/gemma-4-26b-a4b-it:free",
            "openai/gpt-oss-20b:free",
            "nvidia/nemotron-3-nano-30b-a3b:free",
            "openrouter/free"
        ]
        
        # Deduplicate while preserving order
        seen = set()
        unique_models = [x for x in openrouter_models if not (x in seen or seen.add(x))]
        
        for model in unique_models:
            clients.append(
                (
                    f"OpenRouter ({model})",
                    ChatOpenAI(
                        api_key=OPENROUTER_API_KEY,
                        base_url=OPENROUTER_API_URL,
                        model=model,
                        temperature=0.2,
                        default_headers={"HTTP-Referer": "http://localhost:3000", "X-Title": "KAAVAL AI"},
                    ),
                )
            )

    if GROQ_API_KEY:
        clients.append(
            (
                "Groq /free fallback",
                ChatOpenAI(
                    api_key=GROQ_API_KEY,
                    base_url=GROQ_API_URL,
                    model=GROQ_FREE_MODEL,
                    temperature=0.2,
                ),
            )
        )

    if HF_TOKEN:
        clients.append(
            (
                "Hugging Face fallback",
                ChatOpenAI(
                    api_key=HF_TOKEN,
                    base_url=HF_API_URL,
                    model=HUGGINGFACE_FREE_MODEL,
                    temperature=0.2,
                ),
            )
        )

    return clients


def perform_web_search(query_str: str, max_results: int = 3):
    print(f"Executing Web Search Fallback for: '{query_str}'...")
    headers = {
        "User-Agent": (
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
            "AppleWebKit/537.36 (KHTML, like Gecko) "
            "Chrome/120.0.0.0 Safari/537.36"
        )
    }
    encoded_query = urllib.parse.quote_plus(query_str)
    url = f"https://html.duckduckgo.com/html/?q={encoded_query}"

    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=5) as response:
            html = response.read().decode("utf-8", errors="ignore")

        snippets = []
        matches = re.findall(r'<a class="result__snippet[^>]*>(.*?)</a>', html, re.DOTALL)
        for item in matches[:max_results]:
            clean_text = re.sub(r"<[^>]+>", "", item).strip()
            if clean_text:
                snippets.append(clean_text)

        if snippets:
            return snippets, None
        return [], "No web snippets parsed"
    except Exception as exc:
        print(f"Web search error: {exc}")
        return [], str(exc)


def _compose_user_prompt(query: str, context_str: str, conversation_history: List[Dict[str, str]], wants_chart: bool) -> str:
    memory_block = ""
    if conversation_history:
        serialized_turns = []
        for turn in conversation_history[-6:]:
            serialized_turns.append(f"User: {turn.get('query', '')}\nAssistant: {turn.get('response', '')}")
        memory_block = "\n\nRecent Session Memory:\n" + "\n\n".join(serialized_turns)

    chart_hint = (
        "\nUser explicitly requested visualization, so set chart.required=true and chart fields sensibly."
        if wants_chart
        else "\nIf graph is not requested, set chart.required=false."
    )
    return f"User Query:\n{query}\n\nContext:\n{context_str}{memory_block}{chart_hint}"


def _query_llm_with_fallback(
    query: str,
    context_str: str,
    conversation_history: List[Dict[str, str]],
    wants_chart: bool,
) -> Tuple[Optional[Dict[str, Any]], str, List[str]]:
    clients = _build_llm_clients()
    if not clients:
        return None, "No remote LLM provider configured", [
            "Set OPENROUTER_API_KEY (primary), GROQ_API_KEY (fallback), and/or HF_TOKEN (fallback)."
        ]

    user_prompt = _compose_user_prompt(query, context_str, conversation_history, wants_chart)
    errors: List[str] = []

    for source_name, llm_client in clients:
        try:
            result = llm_client.invoke([SystemMessage(content=SYSTEM_PROMPT), HumanMessage(content=user_prompt)])
            parsed = _safe_json_loads(result.content if isinstance(result.content, str) else str(result.content))
            if parsed:
                return parsed, source_name, errors
            errors.append(f"{source_name}: invalid JSON response; trying fallback.")
        except Exception as exc:
            err_str = str(exc)
            if "429" in err_str or "rate limit" in err_str.lower():
                errors.append(f"{source_name}: rate-limited (429); switching provider fallback.")
            else:
                errors.append(f"{source_name}: {err_str}")

    return None, "All LLM providers failed", errors


def _normalize_table(table_obj: Any) -> Optional[Dict[str, Any]]:
    if not isinstance(table_obj, dict):
        return None
    title = str(table_obj.get("title", "Data Table")).strip() or "Data Table"
    columns = table_obj.get("columns", [])
    rows = table_obj.get("rows", [])
    if not isinstance(columns, list) or not columns:
        return None
    if not isinstance(rows, list):
        rows = []
    normalized_rows = []
    for row in rows:
        if isinstance(row, list):
            normalized_rows.append([str(cell) for cell in row[: len(columns)]])
    return {"title": title, "columns": [str(c) for c in columns], "rows": normalized_rows}


def _markdown_table(table_data: Dict[str, Any]) -> str:
    columns: List[str] = table_data["columns"]
    rows: List[List[str]] = table_data["rows"]
    header = "| " + " | ".join(columns) + " |"
    sep = "| " + " | ".join(["---"] * len(columns)) + " |"
    body = ["| " + " | ".join(row + [""] * (len(columns) - len(row))) + " |" for row in rows]
    return "\n".join([header, sep] + body)


def _infer_chart_type(query: str, preferred_type: str) -> str:
    p_type = (preferred_type or "").lower()
    if p_type in {"bar", "line", "scatter", "pie", "area"}:
        return p_type
    q = query.lower()
    if "trend" in q or "over time" in q:
        return "line"
    if "distribution" in q or "share" in q:
        return "pie"
    if "compare" in q or "comparison" in q:
        return "bar"
    return "bar"


def _build_chart_figure(
    query: str,
    chart_spec: Dict[str, Any],
    table_data: Optional[Dict[str, Any]],
    metrics_data: List[Dict[str, Any]],
) -> Tuple[Optional[Dict[str, Any]], Optional[str]]:
    try:
        df: Optional[pd.DataFrame] = None
        if table_data and table_data.get("rows"):
            df = pd.DataFrame(table_data["rows"], columns=table_data["columns"])
        elif metrics_data:
            df = pd.DataFrame(metrics_data)

        if df is None or df.empty:
            return None, "No chartable data available in response."

        for col in df.columns:
            converted = pd.to_numeric(df[col], errors="coerce")
            if converted.notna().sum() > 0:
                df[col] = converted

        numeric_cols = [c for c in df.columns if pd.api.types.is_numeric_dtype(df[c])]
        non_numeric_cols = [c for c in df.columns if c not in numeric_cols]

        x_col = chart_spec.get("x")
        y_col = chart_spec.get("y")
        if x_col not in df.columns:
            x_col = non_numeric_cols[0] if non_numeric_cols else df.columns[0]
        if y_col not in df.columns:
            y_col = numeric_cols[0] if numeric_cols else (df.columns[1] if len(df.columns) > 1 else df.columns[0])

        chart_type = _infer_chart_type(query, str(chart_spec.get("preferred_type", "")))
        title = str(chart_spec.get("title", "Generated Chart")).strip() or "Generated Chart"

        if chart_type == "line":
            fig = px.line(df, x=x_col, y=y_col, title=title)
        elif chart_type == "scatter":
            fig = px.scatter(df, x=x_col, y=y_col, title=title)
        elif chart_type == "pie":
            fig = px.pie(df, names=x_col, values=y_col, title=title)
        elif chart_type == "area":
            fig = px.area(df, x=x_col, y=y_col, title=title)
        else:
            fig = px.bar(df, x=x_col, y=y_col, title=title)

        chart_json = json.loads(
        json.dumps(
        fig,
        cls=PlotlyJSONEncoder
        )

    )
        return chart_json, None
    except Exception as exc:
        return None, f"Chart generation failed: {exc}"


def _compose_markdown_payload(structured: Dict[str, Any], llm_source: str, warnings: List[str]) -> Tuple[str, Optional[Dict[str, Any]], List[Dict[str, Any]], Dict[str, Any]]:
    summary = str(structured.get("summary", "Intelligence generated from available context.")).strip()
    findings = structured.get("primary_findings", [])
    if not isinstance(findings, list):
        findings = [str(findings)]
    findings = [str(item) for item in findings if str(item).strip()]

    stats = structured.get("numeric_statistics", [])
    if not isinstance(stats, list):
        stats = []
    normalized_stats = []
    for stat in stats:
        if isinstance(stat, dict):
            normalized_stats.append(
                {
                    "label": str(stat.get("label", "Metric")),
                    "value": str(stat.get("value", "N/A")),
                }
            )

    table_data = _normalize_table(structured.get("table"))
    chart_spec = structured.get("chart", {}) if isinstance(structured.get("chart"), dict) else {}
    notes = str(structured.get("additional_sources_notes", "")).strip()

    parts = [f"## Summary\n{summary}\n", "## Primary Findings"]
    if findings:
        parts.extend([f"- {item}" for item in findings])
    else:
        parts.append("- No primary findings were returned.")

    if normalized_stats:
        parts.append("\n## Numeric Statistics")
        parts.extend([f"- **{item['label']}:** {item['value']}" for item in normalized_stats])

    if table_data:
        parts.append(f"\n## {table_data['title']}")
        parts.append(_markdown_table(table_data))

    parts.append("\n## Additional Intelligence & Sources")
    parts.append(f"- LLM Provider Used: {llm_source}")
    if notes:
        parts.append(f"- Notes: {notes}")
    if warnings:
        parts.append("- Warnings:")
        parts.extend([f"  - {warning}" for warning in warnings])

    return "\n".join(parts).strip(), table_data, normalized_stats, chart_spec


def execute_ml_query(
    query: str,
    context_str: str = "",
    conversation_history: Optional[List[Dict[str, str]]] = None,
) -> Tuple[Optional[Dict[str, Any]], str]:
    wants_chart = bool(CHART_QUERY_PATTERN.search(query))
    memory = conversation_history or []

    structured, llm_source, llm_warnings = _query_llm_with_fallback(
        query=query,
        context_str=context_str,
        conversation_history=memory,
        wants_chart=wants_chart,
    )
    if not structured:
        fallback_response = (
            "## Summary\n"
            "KAAVAL AI could not reach a text-generation provider right now.\n\n"
            "## Primary Findings\n"
            "- Please retry in a few seconds.\n"
            "- Verify OPENROUTER_API_KEY, GROQ_API_KEY, and HF_TOKEN configuration.\n\n"
            "## Additional Intelligence & Sources\n"
            f"- Error Context: {' | '.join(llm_warnings) if llm_warnings else 'No additional diagnostics available.'}"
        )
        return {
            "response": fallback_response,
            "table": None,
            "chart": None,
            "warnings": llm_warnings,
        }, llm_source

    markdown_response, table_data, numeric_stats, chart_spec = _compose_markdown_payload(
        structured=structured,
        llm_source=llm_source,
        warnings=llm_warnings,
    )

    chart_payload = None
    chart_required = bool(chart_spec.get("required", False)) or wants_chart
    if chart_required:
        chart_payload, chart_warning = _build_chart_figure(
            query=query,
            chart_spec=chart_spec,
            table_data=table_data,
            metrics_data=numeric_stats,
        )
        if chart_warning:
            llm_warnings.append(chart_warning)

    return {
        "response": markdown_response,
        "table": table_data,
        "chart": chart_payload,
        "warnings": llm_warnings,
    }, llm_source
