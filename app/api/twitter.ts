import { twitter__tweet_endpoint, twitter__user_endpoint } from "app/constatnts"
import { BlitzApiRequest, BlitzApiResponse } from "blitz"

const tweetIdParser = (url: string) => {
  url = url.slice(url.indexOf("status/") + 7)
  if (url.indexOf("/") > -1) {
    url = url.slice(url.indexOf("/"))
  }
  if (url.indexOf("?") > -1) {
    url = url.slice(0, url.indexOf("?"))
  }
  console.log(url)
  return url
}

const handler = async (req: BlitzApiRequest, res: BlitzApiResponse) => {
  const id = tweetIdParser(
    (req.query.url === undefined
      ? ""
      : typeof req.query.url !== "string"
      ? req.query.url[0]
      : req.query.url) as string
  )

  const token = process.env.TWITTER_BEARER_TOKEN
  const params = {
    ids: id,
    "tweet.fields": "author_id,public_metrics",
  }

  const tweetResponse = await fetch(twitter__tweet_endpoint + new URLSearchParams(params), {
    headers: { authorization: `Bearer ${token}` },
  })
  const tweetJson = await tweetResponse.json()

  console.log(tweetJson)

  const tweet = tweetJson.data[0]
  const userResponse = await fetch(`${twitter__user_endpoint}${tweet.author_id}`, {
    headers: { authorization: `Bearer ${token}` },
  })
  const user = (await userResponse.json()).data

  res.end(
    JSON.stringify({
      name: user.name,
      username: user.username,
      text: tweet.text,
      public_metrics: tweet.public_metrics,
    })
  )
}

export default handler
