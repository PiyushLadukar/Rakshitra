def map_crime(text):

    text = str(text).lower()

    if "rape" in text:
        return "Rape"

    elif "homicide" in text or "murder" in text:
        return "Homicide"

    elif "assault" in text or "attack" in text:
        return "Assault"

    elif any(word in text for word in ["theft", "stolen", "burglary", "vehicle", "robbery"]):
        return "Theft"

    elif any(word in text for word in ["fraud", "cyber", "identity", "counterfeiting", "scam"]):
        return "Cyber Crime"

    elif any(word in text for word in ["kidnap", "abduction"]):
        return "Kidnapping"

    elif any(word in text for word in ["extortion"]):
        return "Extortion"

    elif any(word in text for word in ["vandalism"]):
        return "Vandalism"

    else:
        return "Other"