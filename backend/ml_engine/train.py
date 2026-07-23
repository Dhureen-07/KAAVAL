import joblib
import pandas as pd

from sklearn.feature_extraction.text import TfidfVectorizer

from config import DATA_DIR, MODEL_DIR

# -----------------------
# Load Dataset
# -----------------------

crime_file = DATA_DIR / "CRIME_REVIEW_2021_TO_2024_KARNATAKA.csv"

df = pd.read_csv(crime_file)

# -----------------------
# Clean text
# -----------------------

df["ACT"] = df["ACT"].fillna("Unknown")
df["MAJOR HEAD"] = df["MAJOR HEAD"].fillna("Unknown")
df["MINOR HEAD"] = df["MINOR HEAD"].fillna("Unknown")

df["crime_text"] = (
    df["ACT"]
    + " "
    + df["MAJOR HEAD"]
    + " "
    + df["MINOR HEAD"]
)

# -----------------------
# Train TF-IDF
# -----------------------

vectorizer = TfidfVectorizer(
    stop_words="english",
    lowercase=True
)

crime_vectors = vectorizer.fit_transform(df["crime_text"])

# -----------------------
# Save everything
# -----------------------

joblib.dump(vectorizer, MODEL_DIR / "tfidf_vectorizer.pkl")
joblib.dump(crime_vectors, MODEL_DIR / "crime_vectors.pkl")
joblib.dump(df, MODEL_DIR / "crime_dataframe.pkl")

print("Training Complete")
print("Vector Shape:", crime_vectors.shape)