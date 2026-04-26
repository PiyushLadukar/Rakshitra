from news_fetcher import fetch_news
from ai_parser import extract_with_nlp

def process_news():

    news = fetch_news()

    structured = []

    for n in news:
        title = n.get("title", "") or ""
        desc = n.get("description", "") or ""

        text = title + " " + desc

        data = extract_with_nlp(text)

        structured.append({
            "city": data["city"],
            "state": data["state"],
            "crime": data["crime"],
            "text": title
        })

    return structured


if __name__ == "__main__":

    structured = process_news()

    print("\nStructured Data (NLP):\n")

    if not structured:
        print("No data found ❌")
    else:
        for item in structured:
            print(item)