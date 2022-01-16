import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const CreateTweet = z.object({
  tweetId: z.string(),
  user: z.object({
    id: z.number(),
  }),
})

export default resolver.pipe(resolver.zod(CreateTweet), resolver.authorize(), async (input) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const tweet = await db.tweet.create({
    data: { tweetId: input.tweetId, user: { connect: input.user } },
  })

  return tweet
})
