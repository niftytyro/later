import { Box, Button, Checkbox, Flex, Input, Text, useCheckbox } from "@chakra-ui/react"
import { ArticlesIcon, TwitterIcon, YoutubeIcon } from "app/core/icons"
import Layout from "app/core/layouts/Layout"
import { BlitzComponentType, BlitzPage } from "blitz"
import { useState } from "react"

interface FiltersListProps {
  title: string
}
interface FiltersOptionProps {
  title: string
  checked: boolean
  toggle: () => void
}

const Header: React.FC = () => {
  return (
    <Text mb="16" color={"white"} fontFamily={"Poly"} fontSize={"3xl"} fontWeight={"medium"}>
      later.
    </Text>
  )
}

const FiltersList: React.FC<FiltersListProps> = ({ children, title }) => {
  return (
    <Box>
      <Text color={"gray.400"} fontSize={"l"} mb="2">
        {title}
      </Text>
      {children}
    </Box>
  )
}

const FiltersOption: React.FC<FiltersOptionProps> = ({ title, checked, toggle, children }) => {
  return (
    <Box>
      <Checkbox isChecked={checked} onChange={toggle} colorScheme={"messenger"}>
        <Flex ml="2" alignItems={"center"}>
          {children}
          <Text ml="2" color={checked ? "gray.50" : "gray.400"} fontSize={"xl"}>
            {title}
          </Text>
        </Flex>
      </Checkbox>
    </Box>
  )
}

const Home: BlitzPage = () => {
  const [twitterChecked, setTwitterChecked] = useState(true)
  const [articlesChecked, setArticlesChecked] = useState(true)
  const [youtubeChecked, setYoutubeChecked] = useState(true)

  return (
    <Flex bg={"gray.800"} w="100vw" h="100vh" py="8" px="16">
      <Box flex={1}>
        <Header />
        <FiltersList title="APPS">
          <FiltersOption
            checked={twitterChecked}
            toggle={() => {
              setTwitterChecked(!twitterChecked)
            }}
            title="Twitter"
          >
            <TwitterIcon active={twitterChecked} />
          </FiltersOption>
          <FiltersOption
            checked={articlesChecked}
            toggle={() => {
              setArticlesChecked(!articlesChecked)
            }}
            title="Articles"
          >
            <ArticlesIcon active={articlesChecked} />
          </FiltersOption>
          <FiltersOption
            checked={youtubeChecked}
            toggle={() => {
              setYoutubeChecked(!youtubeChecked)
            }}
            title="Youtube"
          >
            <YoutubeIcon active={youtubeChecked} />
          </FiltersOption>
        </FiltersList>
      </Box>
      <Box flex={4}>
        <Flex flexDirection={"column"} alignItems={"flex-end"}>
          <Input />
          <Button mt="4" size={"lg"}>
            Submit
          </Button>
        </Flex>
      </Box>
    </Flex>
  )
}

Home.suppressFirstRenderFlicker = true
Home.getLayout = (page) => <Layout title="Home">{page}</Layout>

export default Home
