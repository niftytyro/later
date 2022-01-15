import { resolver, NotFoundError } from "blitz"
import db from "db"
import { z } from "zod"

const GetTweet = z.object({
  // This accepts type of undefined, but is required at runtime
  id: z.number().optional().refine(Boolean, "Required"),
})

export default resolver.pipe(resolver.zod(GetTweet), resolver.authorize(), async ({ id }) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const tweet = await db.tweet.findFirst({ where: { id } })

  if (!tweet) throw new NotFoundError()

  return tweet
})
