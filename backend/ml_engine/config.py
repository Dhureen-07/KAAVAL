from pathlib import Path

# Root of the ML engine
BASE_DIR = Path(__file__).resolve().parent

# Dataset folder
DATA_DIR = BASE_DIR / "data"

# Trained models folder
MODEL_DIR = BASE_DIR / "models"

# Create folders automatically if they don't exist
DATA_DIR.mkdir(exist_ok=True)
MODEL_DIR.mkdir(exist_ok=True)