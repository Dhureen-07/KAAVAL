def execute_district_query(query: str):
    """
    Handles intelligence queries specifically related to Karnataka Police districts, 
    active cases, and regional severity.
    """
    # Mocked telemetry data for demonstration. In a real system, this would query
    # the live CAD/Dispatch database or aggregate current active cases by district.
    districts = [
        {"name": "Bengaluru Urban", "severity": "CRITICAL", "active_firs": 482, "notes": "High volume of cyber & property crime."},
        {"name": "Mysuru City", "severity": "HIGH", "active_firs": 210, "notes": "Recent spike in traffic violations."},
        {"name": "Mangaluru Coastal", "severity": "MEDIUM", "active_firs": 145, "notes": "Coastal security alerts active."},
        {"name": "Hubballi-Dharwad", "severity": "MEDIUM", "active_firs": 189, "notes": "Stable operations."},
        {"name": "Belagavi Division", "severity": "LOW", "active_firs": 98, "notes": "Routine patrols."}
    ]
    
    query_lower = query.lower()
    
    matched = []
    for d in districts:
        if d["name"].split()[0].lower() in query_lower:
            matched.append(d)
            
    if not matched:
        # If they just asked for "district stats" generally, return top 3
        matched = districts[:3]
        
    return matched, "KAAVAL Live Telemetry Database"
