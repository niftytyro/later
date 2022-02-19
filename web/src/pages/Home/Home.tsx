import { AddIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Checkbox,
  Flex,
  Input,
  Spinner,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchApi } from "src/utils/api";
import { ArticlesIcon, TwitterIcon, YoutubeIcon } from "../../icons";
import { NewTweetModal } from "./Modal";
import { SavedPost, TweetCard } from "./Tweet";

export interface Tag {
  id: number;
  name: string;
}

interface FiltersListProps {
  title: string;
}

interface FiltersOptionProps {
  title: string;
  checked: boolean;
  toggle: () => void;
}

const Header: React.FC = () => {
  return (
    <Text
      mb="16"
      color={"white"}
      fontFamily={"Poly"}
      fontSize={"3xl"}
      fontWeight={"medium"}
    >
      later.
    </Text>
  );
};

const FiltersList: React.FC<FiltersListProps> = ({ children, title }) => {
  return (
    <Box>
      <Text color={"gray.400"} fontSize={"l"} mb="2">
        {title}
      </Text>
      {children}
    </Box>
  );
};

const FiltersOption: React.FC<FiltersOptionProps> = ({
  title,
  checked,
  toggle,
  children,
}) => {
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
  );
};

const Home: React.FC = () => {
  const [twitterChecked, setTwitterChecked] = useState(true);
  const [articlesChecked, setArticlesChecked] = useState(true);
  const [youtubeChecked, setYoutubeChecked] = useState(true);

  const [search, setSearch] = useState("");
  const [posts, setPosts] = useState<SavedPost[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);

  const {
    isOpen: newTweetModalIsOpen,
    onOpen: onNewTweetModalOpen,
    onClose: onNewTweetModalClose,
  } = useDisclosure();

  const addTweet = useCallback(
    async (url: string, tags: string[]) => {
      const post = await fetchApi("/posts/create", {
        method: "POST",
        body: { url, tags },
      });
      if (post.key === "success") {
        setPosts([...posts, post.data]);
      }
    },
    [posts]
  );

  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const postResponse = await fetchApi("/posts");
        if (postResponse.key === "unauthenticated") {
          navigate("/auth", { replace: true });
        }
        setPosts(postResponse.data.posts);
        const tagsResponse = await fetchApi("/tags");
        if (tagsResponse.key === "success") {
          setTags(tagsResponse.data.tags);
        }
      } catch (e) {
        console.log(e);
      }
    })();
    return () => setPosts([]);
  }, [navigate]);

  return (
    <Flex bg={"gray.800"} w="100vw" h="100vh" py="8" px="16">
      <Box minWidth={"20%"} flex={1}>
        <Header />
        <FiltersList title="APPS">
          <FiltersOption
            checked={twitterChecked}
            toggle={() => {
              setTwitterChecked(!twitterChecked);
            }}
            title="Twitter"
          >
            <TwitterIcon active={twitterChecked} />
          </FiltersOption>
          <FiltersOption
            checked={articlesChecked}
            toggle={() => {
              setArticlesChecked(!articlesChecked);
            }}
            title="Articles"
          >
            <ArticlesIcon active={articlesChecked} />
          </FiltersOption>
          <FiltersOption
            checked={youtubeChecked}
            toggle={() => {
              setYoutubeChecked(!youtubeChecked);
            }}
            title="Youtube"
          >
            <YoutubeIcon active={youtubeChecked} />
          </FiltersOption>
        </FiltersList>
      </Box>
      <Box display={"flex"} flexDir="column" maxWidth={"80%"} flex={4}>
        <Flex
          height={"max-content"}
          flexDirection={"column"}
          alignItems={"flex-end"}
        >
          <Input
            value={search}
            placeholder="https://twitter.com/hey_yogini/status/1482423775283286016?s=20"
            onChange={(event) => {
              setSearch(event.target.value);
            }}
          />
          <Button onClick={onNewTweetModalOpen} mt="4" size={"lg"}>
            <Flex alignItems={"center"}>
              <AddIcon mr={4} boxSize={4} />
              <Text>New Tweet</Text>
            </Flex>
          </Button>
        </Flex>
        {!posts ? (
          <Box
            display={"flex"}
            justifyContent="center"
            alignItems={"center"}
            flex={1}
          >
            <Spinner
              thickness="4px"
              speed="0.65s"
              emptyColor="gray.600"
              color="blue.500"
              size="xl"
            />
          </Box>
        ) : (
          <Box
            width={"100%"}
            mt="8"
            sx={{ columnCount: [1, 2], columnGap: "8px" }}
          >
            {posts.map((post, idx) => (
              <TweetCard key={idx} post={post} />
            ))}
          </Box>
        )}
      </Box>
      <NewTweetModal
        isOpen={newTweetModalIsOpen}
        onClose={() => {
          onNewTweetModalClose();
        }}
        addTweet={addTweet}
        tags={tags}
      />
    </Flex>
  );
};

export default Home;
