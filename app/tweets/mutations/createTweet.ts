import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const CreateTweet = z.object({
  name: z.string(),
})

export default resolver.pipe(resolver.zod(CreateTweet), resolver.authorize(), async (input) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const tweet = await db.tweet.create({ data: input })

  return tweet
})
