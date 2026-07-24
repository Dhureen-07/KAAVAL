import sqlite3
import os
import csv
import urllib.request
import sys
import auto_downloader

# Configuration
DB_PATH = os.path.join(os.path.dirname(__file__), 'kaaval.db')
DATA_DIR = os.path.join(os.path.dirname(__file__), 'data')

# Add any direct CSV download URLs from OpenCity here
OPENCITY_URLS = [
    # E.g. "https://data.opencity.in/dataset/..." (must be the direct raw .csv URL)
    # Since OpenCity URLs change dynamically and have UUIDs, 
    # it is recommended to manually download them into the /data folder.
]

def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def download_opencity_datasets():
    """Downloads known CSV datasets from direct URLs if provided."""
    for i, url in enumerate(OPENCITY_URLS):
        print(f"Downloading {url}...")
        try:
            filename = os.path.join(DATA_DIR, f"opencity_download_{i}.csv")
            urllib.request.urlretrieve(url, filename)
            print(f"Downloaded successfully: {filename}")
        except Exception as e:
            print(f"Failed to download {url}: {e}")

def chunk_and_ingest_csv(filepath, filename):
    """Reads a CSV file, chunks rows, and inserts into the SQLite DB."""
    conn = get_connection()
    cursor = conn.cursor()
    
    source_name = f"Custom Dataset: {filename}"
    
    # Check if this dataset was already ingested
    cursor.execute("SELECT COUNT(*) FROM resources WHERE source = ?", (source_name,))
    if cursor.fetchone()[0] > 0:
        print(f"Skipping {filename} - already ingested in database.")
        conn.close()
        return

    print(f"Ingesting {filename} into database...")
    try:
        with open(filepath, 'r', encoding='utf-8-sig', errors='ignore') as f:
            reader = csv.reader(f)
            headers = next(reader, None)
            if not headers:
                print(f"Empty CSV or no headers: {filename}")
                return
                
            batch = []
            for row in reader:
                # Create a readable summary of the row
                content_parts = []
                title = f"Data Record from {filename}"
                
                for i, col_val in enumerate(row):
                    col_name = headers[i] if i < len(headers) else f"Column_{i}"
                    if col_val.strip():
                        content_parts.append(f"{col_name}: {col_val.strip()}")
                        
                        # Try to find a good title column (e.g. 'Crime', 'District', 'Section')
                        if not batch and any(k in col_name.lower() for k in ['crime', 'district', 'section', 'head']):
                            title = f"Crime Data: {col_val.strip()}"
                            
                if content_parts:
                    content_str = " | ".join(content_parts)
                    category = "Crime Statistics 2024/2025"
                    
                    batch.append((title, category, content_str, source_name))
                    
                # Insert in batches of 500
                if len(batch) >= 500:
                    cursor.executemany(
                        "INSERT INTO resources (title, category, content, source) VALUES (?, ?, ?, ?)",
                        batch
                    )
                    batch = []
                    
            # Insert remaining
            if batch:
                cursor.executemany(
                    "INSERT INTO resources (title, category, content, source) VALUES (?, ?, ?, ?)",
                    batch
                )
                
            conn.commit()
            print(f"Successfully ingested all rows from {filename}.")
            
    except Exception as e:
        print(f"Error reading {filename}: {e}")
    finally:
        conn.close()

def main():
    if not os.path.exists(DATA_DIR):
        os.makedirs(DATA_DIR)
        
    print("--- KAAVAL Dataset Ingestion Script ---")
    
    # Integration with auto_downloader
    if "--download" in sys.argv:
        print("Running automated downloader first...")
        auto_downloader.run_all()
        print("---------------------------------------")
        
    # Step 1: Download automated URLs (if any, legacy)
    download_opencity_datasets()
    
    # Step 2: Scan the /data/ directory for CSVs
    csv_files = [f for f in os.listdir(DATA_DIR) if f.endswith('.csv')]
    
    if not csv_files:
        print(f"\nNo CSV files found in {DATA_DIR}.")
        print("Please manually download your Kaggle, OpenCity, or Google Drive CSV datasets and place them in the 'backend/data/' folder, then run this script again.")
        return
        
    print(f"Found {len(csv_files)} CSV files in {DATA_DIR}. Processing...")
    
    for filename in csv_files:
        # We can skip the default IPC ones if we want, but checking `source` will avoid duplicates anyway
        filepath = os.path.join(DATA_DIR, filename)
        chunk_and_ingest_csv(filepath, filename)
        
    print("\nDataset ingestion complete! The AI Assistant now has access to this data.")

if __name__ == "__main__":
    main()
