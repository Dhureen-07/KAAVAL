import sqlite3
import os
import csv
import json
import time
from datetime import datetime

DB_PATH = os.path.join(os.path.dirname(__file__), 'kaaval.db')

def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_connection()
    cursor = conn.cursor()
    
    # 1. Resources table (for police data, IPC laws, safety guidelines, user-uploaded data)
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS resources (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            category TEXT NOT NULL,
            content TEXT NOT NULL,
            source TEXT DEFAULT 'System Dataset',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # 2. FIR Drafts table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS fir_records (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            fir_number TEXT,
            district TEXT,
            incident_type TEXT,
            transcript TEXT NOT NULL,
            draft_content TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # 3. Chat memory & logs table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS chat_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            query TEXT NOT NULL,
            response TEXT NOT NULL,
            sources TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')

    # 4. Vehicles ANPR database table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS vehicles (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            plate_number TEXT UNIQUE NOT NULL,
            owner_name TEXT NOT NULL,
            vehicle_model TEXT NOT NULL,
            color TEXT,
            status TEXT DEFAULT 'CLEAN',
            crime_reference TEXT,
            last_seen_location TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')

    # 5. Case Timelines evidence table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS case_timelines (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            case_id TEXT NOT NULL,
            title TEXT NOT NULL,
            event_timestamp TEXT NOT NULL,
            description TEXT NOT NULL,
            evidence_type TEXT DEFAULT 'STATEMENT',
            verified INTEGER DEFAULT 1,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')

    # 6. SOS Emergency Alerts table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS sos_alerts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            caller_name TEXT DEFAULT 'Anonymous Citizen / Patrol Officer',
            caller_phone TEXT DEFAULT '+91 9876543210',
            latitude REAL NOT NULL,
            longitude REAL NOT NULL,
            address TEXT NOT NULL,
            incident_type TEXT DEFAULT 'CRITICAL EMERGENCY',
            priority TEXT DEFAULT 'HIGH',
            status TEXT DEFAULT 'DISPATCHED',
            assigned_pcr TEXT DEFAULT 'PCR-104 (MG Road Division)',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')

    # 7. Active Cases Registry table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS cases (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            case_id TEXT UNIQUE NOT NULL,
            title TEXT NOT NULL,
            category TEXT DEFAULT 'General Crime',
            priority TEXT DEFAULT 'MEDIUM',
            status TEXT DEFAULT 'OPEN',
            location TEXT DEFAULT 'Bengaluru',
            assigned_officer TEXT DEFAULT 'Inspector V. Rao',
            summary TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')

    # 8. Case Datasets table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS case_datasets (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            dataset_name TEXT NOT NULL,
            case_id TEXT NOT NULL,
            record_count INTEGER DEFAULT 0,
            dataset_json TEXT NOT NULL,
            source TEXT DEFAULT 'Case Evidence Export',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    conn.commit()
    
    # Seed initial datasets if resources table is empty
    cursor.execute("SELECT COUNT(*) FROM resources")
    count = cursor.fetchone()[0]
    if count == 0:
        print("Seeding SQLite database with IPC and Crimes Against Women datasets...")
        data_dir = os.path.join(os.path.dirname(__file__), 'data')
        
        # Seed IPC Crimes
        ipc_file = os.path.join(data_dir, 'ipc_crimes_2024.csv')
        if os.path.exists(ipc_file):
            try:
                with open(ipc_file, 'r', encoding='utf-8-sig') as f:
                    reader = csv.reader(f)
                    next(reader, None)
                    for row in reader:
                        if len(row) >= 3 and row[1].strip() and row[2].strip():
                            title = f"IPC Section / Crime Category: {row[1].strip()}"
                            content = row[2].strip()
                            cursor.execute(
                                "INSERT INTO resources (title, category, content, source) VALUES (?, ?, ?, ?)",
                                (title, "IPC Crime Data 2024", content, "Karnataka IPC Crime Dataset")
                            )
            except Exception as e:
                print("Error seeding IPC dataset into SQLite:", e)
                
        # Seed Women Crimes
        women_file = os.path.join(data_dir, 'crimes_against_women_2024.csv')
        if os.path.exists(women_file):
            try:
                with open(women_file, 'r', encoding='utf-8-sig') as f:
                    reader = csv.reader(f)
                    next(reader, None)
                    for row in reader:
                        if len(row) >= 3 and row[1].strip() and row[2].strip():
                            title = f"Crimes Against Women/Children: {row[1].strip()}"
                            content = row[2].strip()
                            cursor.execute(
                                "INSERT INTO resources (title, category, content, source) VALUES (?, ?, ?, ?)",
                                (title, "Women & Child Safety 2024", content, "Crimes Against Women Dataset")
                            )
            except Exception as e:
                print("Error seeding Women dataset into SQLite:", e)
                
        # Seed 2025 Preliminary Intel
        cursor.execute(
            "INSERT INTO resources (title, category, content, source) VALUES (?, ?, ?, ?)",
            ("Cybercrime Q1 2025 Statistics", "Cyber Security", "Preliminary data shows a 12% rise in cybercrime complaints in Bengaluru Urban for Q1 2025. Cyber-financial fraud constitutes 68% of these cases.", "OpenCity 2025")
        )
        cursor.execute(
            "INSERT INTO resources (title, category, content, source) VALUES (?, ?, ?, ?)",
            ("Traffic & Conviction Metrics 2025", "Traffic & NDPS", "Traffic violations recorded via AI cameras show a 40% enforcement increase. Conviction rates in NDPS cases improved by 4.5%.", "India Data Portal")
        )
        
        conn.commit()
        print("Database seeding completed.")

    # Seed initial vehicles if empty
    cursor.execute("SELECT COUNT(*) FROM vehicles")
    if cursor.fetchone()[0] == 0:
        sample_vehicles = [
            ("KA-03-HA-8812", "Ramesh Kumar", "Hyundai Creta (White)", "White", "STOLEN", "FIR-442/2026 - Vehicle Theft under BNS 303(2)", "Silk Board Junction, Bengaluru"),
            ("KA-01-MJ-4921", "Anand Rao", "Mahindra Thar (Black)", "Black", "WANTED", "Warrant No. 902/2026 - Hit & Run Inquiry", "Indiranagar 100ft Road"),
            ("KA-05-EX-1092", "Suhasini V", "Honda City (Silver)", "Silver", "CLEAN", "No Active Alerts / Valid Insurance", "Koramangala 5th Block"),
            ("KA-04-BB-9901", "Vikramaditya S", "Royal Enfield Bullet (Maroon)", "Maroon", "WANTED", "Associated with Armed Robbery Case FIR-102/2026", "Hebbal Flyover"),
            ("KA-51-P-3341", "Mohammed Irfan", "Maruti Swift (Red)", "Red", "CLEAN", "Verified Police Clearance Passed", "Electronic City Phase 1")
        ]
        for v in sample_vehicles:
            cursor.execute(
                "INSERT INTO vehicles (plate_number, owner_name, vehicle_model, color, status, crime_reference, last_seen_location) VALUES (?, ?, ?, ?, ?, ?, ?)",
                v
            )
        conn.commit()

    # Seed initial timeline nodes if empty
    cursor.execute("SELECT COUNT(*) FROM case_timelines")
    if cursor.fetchone()[0] == 0:
        sample_nodes = [
            ("CASE-2026-089", "Initial Incident Hotline Call", "2026-07-21 14:15", "Witness reported suspicious activity near MG Road ATM kiosk.", "CALL_LOG", 1),
            ("CASE-2026-089", "CCTV Footage Captured", "2026-07-21 14:22", "High-res cameras logged red vehicle fleeing towards Brigade Road.", "CCTV", 1),
            ("CASE-2026-089", "PCR Van Arrival", "2026-07-21 14:28", "Officer Team #104 secured the scene and retrieved physical fingerprint evidence.", "POLICE_REPORT", 1),
            ("CASE-2026-089", "Suspect Identified via ANPR", "2026-07-21 14:45", "ANPR System matched license plate KA-01-MJ-4921 at Trinity Circle.", "ANPR_LOG", 1),
        ]
        for n in sample_nodes:
            cursor.execute(
                "INSERT INTO case_timelines (case_id, title, event_timestamp, description, evidence_type, verified) VALUES (?, ?, ?, ?, ?, ?)",
                n
            )
        conn.commit()

    # Seed initial SOS alerts if empty
    cursor.execute("SELECT COUNT(*) FROM sos_alerts")
    if cursor.fetchone()[0] == 0:
        sample_sos = [
            ("Officer Ramesh (Patrol)", "+91 9845012345", 12.9716, 77.5946, "MG Road Metro Station, Bengaluru", "SUSPECT PURSUIT IN PROGRESS", "HIGH", "DISPATCHED", "PCR-104 (MG Road Division)"),
            ("Priya Sharma (Public)", "+91 9900112233", 12.9352, 77.6245, "Koramangala 4th Block, Bengaluru", "WOMEN SAFETY EMERGENCY SOS", "CRITICAL", "EN_ROUTE", "PCR-208 (Koramangala Division)"),
        ]
        for s in sample_sos:
            cursor.execute(
                "INSERT INTO sos_alerts (caller_name, caller_phone, latitude, longitude, address, incident_type, priority, status, assigned_pcr) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
                s
            )
    # Seed initial cases if empty
    cursor.execute("SELECT COUNT(*) FROM cases")
    if cursor.fetchone()[0] == 0:
        sample_cases = [
            ("CASE-2026-089", "MG Road ATM Robbery & Hit & Run Inquiry", "Armed Robbery / Traffic Violation", "CRITICAL", "UNDER_INVESTIGATION", "MG Road & Trinity Circle, Bengaluru", "Inspector V. Rao", "Armed robbery reported near MG Road ATM. ANPR camera logged getaway vehicle KA-01-MJ-4921 fleeing towards Trinity Circle."),
            ("CASE-2026-090", "Indiranagar Commercial Establishment Theft", "Property Crime", "MEDIUM", "OPEN", "Indiranagar 100ft Road, Bengaluru", "Sub-Inspector K. Sharma", "Break-in reported during non-patrol night hours. Cash register compromised."),
            ("CASE-2026-091", "Koramangala High-Tech Cyber Financial Scam", "Cyber Crime", "HIGH", "OPEN", "Koramangala 4th Block, Bengaluru", "Inspector S. Patil", "Phishing scam targeting senior citizens using fraudulent police verification portals.")
        ]
        for c in sample_cases:
            cursor.execute(
                "INSERT INTO cases (case_id, title, category, priority, status, location, assigned_officer, summary) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                c
            )
        conn.commit()

    conn.close()

def get_all_resources(category=None):
    conn = get_connection()
    cursor = conn.cursor()
    if category:
        cursor.execute("SELECT * FROM resources WHERE category = ? ORDER BY id DESC", (category,))
    else:
        cursor.execute("SELECT * FROM resources ORDER BY id DESC")
    rows = [dict(r) for r in cursor.fetchall()]
    conn.close()
    return rows

def add_resource(title, category, content, source="User Upload"):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO resources (title, category, content, source) VALUES (?, ?, ?, ?)",
        (title, category, content, source)
    )
    conn.commit()
    res_id = cursor.lastrowid
    conn.close()
    return res_id

def delete_resource(resource_id):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM resources WHERE id = ?", (resource_id,))
    conn.commit()
    conn.close()

def search_resources(query_str, limit=5):
    conn = get_connection()
    cursor = conn.cursor()
    keywords = query_str.lower().split()
    results = []
    
    # Try exact or multi-word matching first
    like_query = f"%{query_str}%"
    cursor.execute(
        "SELECT * FROM resources WHERE title LIKE ? OR content LIKE ? OR category LIKE ? LIMIT ?",
        (like_query, like_query, like_query, limit)
    )
    exact_rows = [dict(r) for r in cursor.fetchall()]
    results.extend(exact_rows)
    
    # Keyword fallback if exact match produces few results
    if len(results) < limit and keywords:
        for kw in keywords:
            if len(kw) <= 2:
                continue
            kw_like = f"%{kw}%"
            cursor.execute(
                "SELECT * FROM resources WHERE title LIKE ? OR content LIKE ? LIMIT ?",
                (kw_like, kw_like, limit - len(results))
            )
            rows = [dict(r) for r in cursor.fetchall()]
            for r in rows:
                if not any(res['id'] == r['id'] for res in results):
                    results.append(r)
            if len(results) >= limit:
                break
                
    conn.close()
    return results

def save_fir(transcript, draft_content, fir_number=None, district="Bengaluru City", incident_type="General"):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO fir_records (fir_number, district, incident_type, transcript, draft_content) VALUES (?, ?, ?, ?, ?)",
        (fir_number, district, incident_type, transcript, draft_content)
    )
    conn.commit()
    fir_id = cursor.lastrowid
    conn.close()
    return fir_id

def get_recent_firs(limit=10):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM fir_records ORDER BY id DESC LIMIT ?", (limit,))
    rows = [dict(r) for r in cursor.fetchall()]
    conn.close()
    return rows

def save_chat_log(query, response, sources):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO chat_logs (query, response, sources) VALUES (?, ?, ?)",
        (query, response, json.dumps(sources) if isinstance(sources, list) else str(sources))
    )
    conn.commit()
    conn.close()

# --- VEHICLES ANPR HELPER FUNCTIONS ---
def get_vehicle_by_plate(plate_num):
    conn = get_connection()
    cursor = conn.cursor()
    plate_clean = plate_num.replace("-", "").replace(" ", "").upper()
    cursor.execute("SELECT * FROM vehicles")
    rows = [dict(r) for r in cursor.fetchall()]
    conn.close()
    for r in rows:
        db_plate_clean = r['plate_number'].replace("-", "").replace(" ", "").upper()
        if db_plate_clean in plate_clean or plate_clean in db_plate_clean:
            return r
    return None

def add_vehicle(plate_number, owner_name, vehicle_model, color, status="CLEAN", crime_reference="", last_seen_location="Unknown"):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT OR REPLACE INTO vehicles (plate_number, owner_name, vehicle_model, color, status, crime_reference, last_seen_location) VALUES (?, ?, ?, ?, ?, ?, ?)",
        (plate_number.upper(), owner_name, vehicle_model, color, status, crime_reference, last_seen_location)
    )
    conn.commit()
    v_id = cursor.lastrowid
    conn.close()
    return v_id

def get_all_vehicles():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM vehicles ORDER BY id DESC")
    rows = [dict(r) for r in cursor.fetchall()]
    conn.close()
    return rows

# --- CASE TIMELINE HELPER FUNCTIONS ---
def get_case_timeline(case_id=None):
    conn = get_connection()
    cursor = conn.cursor()
    if case_id:
        cursor.execute("SELECT * FROM case_timelines WHERE case_id = ? ORDER BY event_timestamp ASC", (case_id,))
    else:
        cursor.execute("SELECT * FROM case_timelines ORDER BY event_timestamp ASC")
    rows = [dict(r) for r in cursor.fetchall()]
    conn.close()
    return rows

def add_timeline_node(case_id, title, event_timestamp, description, evidence_type="STATEMENT", verified=1):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO case_timelines (case_id, title, event_timestamp, description, evidence_type, verified) VALUES (?, ?, ?, ?, ?, ?)",
        (case_id, title, event_timestamp, description, evidence_type, verified)
    )
    conn.commit()
    node_id = cursor.lastrowid
    conn.close()
    return node_id

def delete_timeline_node(node_id):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM case_timelines WHERE id = ?", (node_id,))
    conn.commit()
    conn.close()

# --- CASES & DATASETS HELPER FUNCTIONS ---
def create_case(case_id, title, category="General Crime", priority="MEDIUM", status="OPEN", location="Bengaluru", assigned_officer="Inspector V. Rao", summary=""):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT OR REPLACE INTO cases (case_id, title, category, priority, status, location, assigned_officer, summary) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        (case_id, title, category, priority, status, location, assigned_officer, summary)
    )
    conn.commit()
    c_id = cursor.lastrowid
    conn.close()
    return c_id

def get_all_cases():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM cases ORDER BY id DESC")
    rows = [dict(r) for r in cursor.fetchall()]
    conn.close()
    return rows

def get_case_by_id(case_id):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM cases WHERE case_id = ?", (case_id,))
    row = cursor.fetchone()
    conn.close()
    return dict(row) if row else None

def save_case_dataset(dataset_name, case_id, description=""):
    conn = get_connection()
    cursor = conn.cursor()
    
    cursor.execute("SELECT * FROM cases WHERE case_id = ?", (case_id,))
    case_row = cursor.fetchone()
    case_info = dict(case_row) if case_row else {"case_id": case_id, "title": f"Case {case_id}"}
    
    cursor.execute("SELECT * FROM case_timelines WHERE case_id = ? ORDER BY event_timestamp ASC", (case_id,))
    logs = [dict(r) for r in cursor.fetchall()]
    
    dataset_payload = {
        "dataset_name": dataset_name,
        "case_info": case_info,
        "record_count": len(logs),
        "description": description,
        "exported_at": datetime.now().isoformat(),
        "logs": logs
    }
    
    json_str = json.dumps(dataset_payload, indent=2)
    
    cursor.execute(
        "INSERT INTO case_datasets (dataset_name, case_id, record_count, dataset_json, source) VALUES (?, ?, ?, ?, ?)",
        (dataset_name, case_id, len(logs), json_str, f"Case {case_id} Evidence Dataset")
    )
    ds_id = cursor.lastrowid
    
    # Also register dataset into resources table so RAG assistant can query it
    resource_title = f"Case Dataset: {dataset_name} ({case_id})"
    resource_content = f"Case Dataset for {case_info.get('title', case_id)} (Total Logs: {len(logs)}). Logs Summary: " + " | ".join([f"[{l.get('event_timestamp')}] {l.get('title')}: {l.get('description')}" for l in logs])
    cursor.execute(
        "INSERT INTO resources (title, category, content, source) VALUES (?, ?, ?, ?)",
        (resource_title, "Case Dataset", resource_content, f"KAAVAL Case Dataset #{ds_id}")
    )
    
    conn.commit()
    conn.close()
    return ds_id

def get_all_case_datasets():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id, dataset_name, case_id, record_count, source, created_at FROM case_datasets ORDER BY id DESC")
    rows = [dict(r) for r in cursor.fetchall()]
    conn.close()
    return rows

# --- SOS EMERGENCY HELPER FUNCTIONS ---
def create_sos_alert(caller_name, caller_phone, latitude, longitude, address, incident_type, priority="CRITICAL"):
    conn = get_connection()
    cursor = conn.cursor()
    assigned_pcr = f"PCR-{100 + (int(time.time()) % 900)} (Karnataka Dispatch Network)"
    cursor.execute(
        "INSERT INTO sos_alerts (caller_name, caller_phone, latitude, longitude, address, incident_type, priority, status, assigned_pcr) VALUES (?, ?, ?, ?, ?, ?, ?, 'DISPATCHED', ?)",
        (caller_name, caller_phone, latitude, longitude, address, incident_type, priority, assigned_pcr)
    )
    conn.commit()
    alert_id = cursor.lastrowid
    conn.close()
    return alert_id, assigned_pcr

def get_all_sos_alerts():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM sos_alerts ORDER BY id DESC")
    rows = [dict(r) for r in cursor.fetchall()]
    conn.close()
    return rows

def update_sos_status(alert_id, status):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("UPDATE sos_alerts SET status = ? WHERE id = ?", (status, alert_id))
    conn.commit()
    conn.close()

if __name__ == '__main__':
    init_db()
    print("Database test complete. Total resources in DB:", len(get_all_resources()))


