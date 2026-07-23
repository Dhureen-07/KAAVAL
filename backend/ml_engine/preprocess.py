import pandas as pd
from config import DATA_DIR

crime_file = DATA_DIR / "CRIME_REVIEW_2021_TO_2024_KARNATAKA.csv"

df = pd.read_csv(crime_file)

# -------------------------------
# Clean text columns
# -------------------------------
df["ACT"] = df["ACT"].fillna("Unknown")
df["MAJOR HEAD"] = df["MAJOR HEAD"].fillna("Unknown")
df["MINOR HEAD"] = df["MINOR HEAD"].fillna("Unknown")

# -------------------------------
# Clean numeric columns
# -------------------------------
numeric_cols = [
    "During the current year upto the end of month under review",
    "During the corresponding month of previous year",
    "During the previous month",
    "During the current month",
]

for col in numeric_cols:
    df[col] = pd.to_numeric(df[col], errors="coerce")
    df[col] = df[col].fillna(0)

# -------------------------------
# Create searchable text
# -------------------------------
df["crime_text"] = (
    df["ACT"] + " " +
    df["MAJOR HEAD"] + " " +
    df["MINOR HEAD"]
)

print(df[["crime_text"]].head())