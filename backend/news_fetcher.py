import requests
import os
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("NEWS_API_KEY")

def fetch_news():

    url = "https://newsapi.org/v2/everything"

    params = {
        "q": "crime India",   # simpler query
        "apiKey": API_KEY,
        "pageSize": 20,
        "language": "en",
        "sortBy": "publishedAt"
    }

    response = requests.get(url, params=params)
    data = response.json()

    articles = []

    strong_keywords = ["murder", "rape", "killed"]
    weak_keywords = ["crime", "attack", "robbery", "assault", "theft"]

    for article in data.get("articles", []):
        title = article.get("title", "") or ""
        desc = article.get("description", "") or ""

        text = (title + " " + desc).lower()

        # balanced filtering
        if (
            any(word in text for word in strong_keywords)
            or sum(word in text for word in weak_keywords) >= 1
        ):
            articles.append({
                "title": title,
                "description": desc,
                "published_at": article.get("publishedAt")
            })

    return articles


if __name__ == "__main__":
    news = fetch_news()

    print("\nFiltered Crime News:\n")

    if not news:
        print("No crime news found (try again or increase pageSize)")
    else:
        for n in news:
            print("-", n["title"])