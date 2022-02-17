def parse_tweet_id(url: str) -> str | None:
    idPosition = url.find("status/") + 7

    if idPosition < 7:
        return None

    id = url[idPosition:]
    id = id[: id.find("/")]
    id = id[: id.find("?")]

    return id
