import httpx

from server import constants


def parse_tweet_id(url: str) -> str | None:
    idPosition = url.find("status/") + 7

    if idPosition < 7:
        return None

    id = url[idPosition:]
    id = id[: id.find("/")]
    id = id[: id.find("?")]

    return id


def fetch_tweet(post_id: str):
    ids = f"ids={post_id}"
    tweet_fields = "tweet.fields=author_id,public_metrics,created_at"
    user_fields = "user.fields=profile_image_url"

    tweet_response = httpx.get(
        f"{constants.TWITTER_TWEET_ENDPOINT}?{ids}&{tweet_fields}",
        headers={"authorization": f"Bearer {constants.TWITTER_AUTH_TOKEN}"},
    )
    tweet = tweet_response.json()["data"][0]

    author_response = httpx.get(
        f"{constants.TWITTER_USERS_ENDPOINT}/{tweet['author_id']}?{user_fields}",
        headers={"authorization": f"Bearer {constants.TWITTER_AUTH_TOKEN}"},
    )
    author = author_response.json()["data"]

    return author, tweet
