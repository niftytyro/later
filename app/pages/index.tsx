import { Box } from "@chakra-ui/react"
import Layout from "app/core/layouts/Layout"
import { BlitzPage } from "blitz"

const Home: BlitzPage = () => {
  return (
    <Box bg={"black"} w="100%" h="100%">
      <h1>Hello, World!</h1>
    </Box>
  )
}

Home.suppressFirstRenderFlicker = true
Home.getLayout = (page) => <Layout title="Home">{page}</Layout>

export default Home
