import os
import requests
from bs4 import BeautifulSoup
import gdown
import zipfile

DATA_DIR = os.path.join(os.path.dirname(__file__), 'data')

def download_opencity_datasets():
    """Scrapes OpenCity pages and downloads CSV files automatically."""
    print("[OpenCity] Scraping OpenCity datasets...")
    urls = [
        "https://data.opencity.in/dataset/karnataka-crime-data-2024",
        "https://data.opencity.in/dataset/karnataka-crime-data-2025"
    ]
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
    
    for page_url in urls:
        try:
            res = requests.get(page_url, headers=headers)
            res.raise_for_status()
            soup = BeautifulSoup(res.text, 'html.parser')
            
            # Find all download buttons that point to a .csv file
            links = soup.find_all('a', href=True)
            csv_links = [a['href'] for a in links if a['href'].endswith('.csv')]
            
            for csv_link in csv_links:
                filename = csv_link.split('/')[-1]
                save_path = os.path.join(DATA_DIR, f"opencity_{filename}")
                
                if not os.path.exists(save_path):
                    print(f"  -> Downloading {filename}...")
                    csv_res = requests.get(csv_link, headers=headers)
                    with open(save_path, 'wb') as f:
                        f.write(csv_res.content)
                    print(f"  -> Saved {filename}")
                else:
                    print(f"  -> Already exists: {filename}")
                    
        except Exception as e:
            print(f"[OpenCity] Error scraping {page_url}: {e}")

def download_kaggle_dataset():
    """Uses the Kaggle Python API to download the requested dataset."""
    print("[Kaggle] Downloading Vanshangaria's FIR details dataset...")
    dataset = "vanshangaria/fir-details-karnataka-police"
    
    try:
        from kaggle.api.kaggle_api_extended import KaggleApi
        api = KaggleApi()
        api.authenticate()
        api.dataset_download_files(dataset, path=DATA_DIR, unzip=True)
        print(f"[Kaggle] Successfully downloaded and unzipped {dataset}")
    except Exception as e:
        print(f"[Kaggle] Error running kaggle command: {e}")

def download_google_drive():
    """Attempts to download files from Google Drive share links using gdown."""
    print("[Google Drive] Attempting to download from share links...")
    gdrive_links = {
        "Crime_Data_2024_CKAN": "https://share.google/aKQldf5IonB3DPDPJ",
        "Crime_Review_2021_2024": "https://share.google/ZxIpWeWpfFQzpXedG"
    }
    
    for name, link in gdrive_links.items():
        try:
            print(f"  -> Downloading {name} from GDrive...")
            # Using gdown's fuzzy mode to try and resolve these workspace share links
            gdown.download(url=link, output=os.path.join(DATA_DIR, f"{name}.csv"), quiet=False, fuzzy=True)
        except Exception as e:
            print(f"[Google Drive] Error downloading {name}: {e}")

def run_all():
    if not os.path.exists(DATA_DIR):
        os.makedirs(DATA_DIR)
        
    print("=== KAAVAL Automated Dataset Downloader ===")
    print("This script will attempt to scrape and download files from Kaggle, OpenCity, and Google Drive.\n")
    
    download_opencity_datasets()
    download_kaggle_dataset()
    download_google_drive()
    
    print("\n=== Download Phase Complete ===")
    print("Check your backend/data/ folder. You can now run ingest_datasets.py to load them into SQLite.")

if __name__ == "__main__":
    run_all()
