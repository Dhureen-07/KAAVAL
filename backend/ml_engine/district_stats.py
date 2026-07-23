from ml_engine.resources import district_ipc
from ml_engine.reasoning.entities import extract_entities


def get_district_statistics(query):

    entities = extract_entities(query)
    
    district = entities["district"]
   
    if not district:
        return {
            "found": False,
            "message": "No district detected."
        }

    

    district_data = district_ipc[
        district_ipc["DISTRICT/UNITS"]
        .str.lower()
        .str.contains(district.lower(), na=False)
    ]

    if district_data.empty:
        return {
            "found": False,
            "message": "District not found."
        }

    row = district_data.iloc[0]

    numeric_columns = row.drop(labels=["Sl No", "DISTRICT/UNITS"])

    total_cases = numeric_columns.sum()

    top_crimes = {
        crime: int(count)
        for crime, count in (
            numeric_columns
            .sort_values(ascending=False)
            .head(5)
            .items()
        )
    }
    

    return {
        "found": True,
        "district": row["DISTRICT/UNITS"],
        "total_cases": int(total_cases),
        "top_crimes": top_crimes,
        "data": row.to_dict()
}