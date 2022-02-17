import os

JWT_COOKIE_KEY = "qlwkejsnaxkcj09283"
JWT_SECRET = os.environ.get("JWT_SECRET")
TWITTER_AUTH_TOKEN = os.environ.get("TWITTER_AUTH_TOKEN")
TWITTER_TWEET_ENDPOINT = "https://api.twitter.com/2/tweets"
TWITTER_USERS_ENDPOINT = "https://api.twitter.com/2/users"
