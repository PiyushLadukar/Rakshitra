import spacy

nlp = spacy.load("en_core_web_sm")

def extract_with_nlp(text):

    doc = nlp(text)

    city = "Unknown"
    state = "Unknown"

    for ent in doc.ents:
        if ent.label_ == "GPE":
            value = ent.text.strip()

            # ignore country-level detections
            if value.lower() in ["india", "indian"]:
                continue

            city = value
            break

    text_lower = text.lower()

    if any(word in text_lower for word in ["murder", "killed", "death", "stabbed"]):
        crime = "Homicide"

    elif any(word in text_lower for word in ["rape", "sexual assault"]):
        crime = "Rape"

    elif any(word in text_lower for word in ["assault", "attack", "violence"]):
        crime = "Assault"

    elif any(word in text_lower for word in ["robbery", "theft", "stolen"]):
        crime = "Theft"

    elif any(word in text_lower for word in ["cyber", "fraud", "scam", "hack"]):
        crime = "Cyber Crime"

    else:
        crime = "Other"

    return {
        "city": city,
        "state": state,
        "crime": crime
    }