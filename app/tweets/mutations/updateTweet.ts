import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const UpdateTweet = z.object({
  id: z.number(),
  tweetId: z.string(),
})

export default resolver.pipe(
  resolver.zod(UpdateTweet),
  resolver.authorize(),
  async ({ id, ...data }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const tweet = await db.tweet.update({ where: { id }, data })

    return tweet
  }
)
