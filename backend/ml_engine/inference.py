import joblib

from sklearn.metrics.pairwise import cosine_similarity

from ml_engine.config import MODEL_DIR

# -----------------------
# Load trained objects
# -----------------------

vectorizer = joblib.load(MODEL_DIR / "tfidf_vectorizer.pkl")
crime_vectors = joblib.load(MODEL_DIR / "crime_vectors.pkl")
df = joblib.load(MODEL_DIR / "crime_dataframe.pkl")


def find_similar_crimes(query, top_n=5):

    query_vector = vectorizer.transform([query])

    similarity = cosine_similarity(query_vector, crime_vectors).flatten()

    top_indices = similarity.argsort()[-top_n:][::-1]

    results = df.iloc[top_indices].copy()

    return {
        "query": query,
        "records_found": len(results),
        "years": sorted(results["Year"].unique().tolist()),
        "months": results["Month"].tolist(),
        "similar_cases": results[
            [
                "ACT",
                "MAJOR HEAD",
                "MINOR HEAD",
                "Month",
                "Year",
            ]
        ].to_dict(orient="records"),
    }

if __name__ == "__main__":

    result = find_similar_crimes("chain snatching")

    from pprint import pprint

    pprint(result)