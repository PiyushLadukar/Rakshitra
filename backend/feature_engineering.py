def map_crime(text):
    text = str(text).lower().strip()

    if any(w in text for w in ["rape", "sexual assault"]):
        return "Sexual Assault"
    elif any(w in text for w in ["homicide", "murder"]):
        return "Homicide"
    elif any(w in text for w in ["assault", "attack", "battery"]):
        return "Assault"
    elif any(w in text for w in ["theft", "stolen", "burglary", "robbery", "pickpocket", "larceny", "shoplifting"]):
        return "Theft"
    elif any(w in text for w in ["vehicle", "car", "bike", "motor"]):
        return "Vehicle Crime"
    elif any(w in text for w in ["fraud", "scam", "embezzlement", "forgery", "counterfeiting"]):
        return "Fraud"
    elif any(w in text for w in ["cyber", "identity theft", "hacking", "phishing"]):
        return "Cyber Crime"
    elif any(w in text for w in ["kidnap", "abduction"]):
        return "Kidnapping"
    elif any(w in text for w in ["extortion", "blackmail"]):
        return "Extortion"
    elif any(w in text for w in ["vandalism", "property damage", "arson"]):
        return "Vandalism"
    elif any(w in text for w in ["drug", "narcotics", "substance"]):
        return "Drug Offense"
    elif any(w in text for w in ["public intoxication", "drunk", "disorderly"]):
        return "Public Disorder"
    else:
        return "Other"


def map_weapon(text):
    text = str(text).lower().strip()
    if "firearm" in text or "gun" in text or "pistol" in text:
        return "Firearm"
    elif "knife" in text or "blade" in text:
        return "Knife"
    elif "blunt" in text or "bat" in text:
        return "Blunt Object"
    elif "poison" in text:
        return "Poison"
    elif "explosive" in text or "bomb" in text:
        return "Explosives"
    elif "none" in text or text == "nan":
        return "None"
    else:
        return "Other"


def age_group(age):
    try:
        a = float(age)
        if a < 18:  return "Minor (<18)"
        if a < 30:  return "Youth (18-29)"
        if a < 45:  return "Adult (30-44)"
        if a < 60:  return "Middle-aged (45-59)"
        return "Senior (60+)"
    except:
        return "Unknown"