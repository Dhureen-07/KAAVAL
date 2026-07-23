import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from database import search_resources

def execute_sqlite_query(query: str, limit: int = 4):
    """
    Handles local database retrieval for IPC/BNS statutes, historical cases, and resources.
    """
    db_matches = search_resources(query, limit=limit)
    return db_matches, "SQLite Database (kaaval.db)"
