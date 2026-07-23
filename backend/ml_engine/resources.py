import pandas as pd

from ml_engine.config import DATA_DIR

# ==============================
# DATASETS
# ==============================

crime_review = pd.read_csv(
    DATA_DIR / "CRIME_REVIEW_2021_TO_2024_KARNATAKA.csv"
)

district_ipc = pd.read_csv(
    DATA_DIR / "District-wise IPC Crimes in Karnataka - 2024.csv"
)

ipc_various_heads = pd.read_csv(
    DATA_DIR / "IPC Crimes Under Various Heads in 2024.csv"
)

crime_review_tables = pd.read_csv(
    DATA_DIR / "Karnataka Crime Review 2024 Tables.csv"
)

women_children = pd.read_csv(
    DATA_DIR / "Crimes Against Women Children and SCs-STs - 2024.csv"
)

sll_crimes = pd.read_csv(
    DATA_DIR / "SLL Crimes Under Various Heads - 2024.csv"
)

# ==============================
# CRIME TYPES
# ==============================

major_heads = (
    crime_review["MAJOR HEAD"]
    .dropna()
    .astype(str)
    .str.strip()
    .str.lower()
    .unique()
    .tolist()
)

minor_heads = (
    crime_review["MINOR HEAD"]
    .dropna()
    .astype(str)
    .str.strip()
    .str.lower()
    .unique()
    .tolist()
)

CRIME_TYPES = sorted(
    [
        c for c in set(major_heads + minor_heads)
        if len(c.strip()) > 2
    ],
)

COMMON_CRIME_ALIASES = [
    "theft",
    "murder",
    "rape",
    "robbery",
    "burglary",
    "cyber crime",
    "cybercrime",
    "kidnapping",
    "assault",
    "fraud",
]

CRIME_TYPES = sorted(set(CRIME_TYPES + COMMON_CRIME_ALIASES))


# ==============================
# DISTRICTS
# ==============================

DISTRICTS = (
    district_ipc["DISTRICT/UNITS"]
    .dropna()
    .astype(str)
    .str.strip()
    .str.lower()
    .unique()
    .tolist()
)
DISTRICT_ALIASES = {
    "mysuru": "Mysuru",
    "mysore": "Mysuru",

    "bengaluru": "Bengaluru",
    "bangalore": "Bengaluru",

    "mangalore": "Mangaluru",
    "hubli": "Hubballi Dharwad",
    "gulbarga": "Kalaburagi",
}

if __name__ == "__main__":

    print("Crime Types:", len(CRIME_TYPES))
    print(CRIME_TYPES[:10])

    print()

    print("Districts:", len(DISTRICTS))
    print(DISTRICTS)