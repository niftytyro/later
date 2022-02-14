def parse_tweet_id(url: str) -> str:
    idPosition = url.find("status/") + 7

    if idPosition < 7:
        idPosition = 0

    id = url[idPosition:]
    id = id[: id.find("/")]
    id = id[: id.find("?")]

    return id
