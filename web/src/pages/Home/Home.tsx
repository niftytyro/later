import { AddIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Checkbox,
  Flex,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Tag,
  TagCloseButton,
  TagLabel,
  Text,
  useDisclosure,
  Wrap,
} from "@chakra-ui/react";
import dayjs, { Dayjs } from "dayjs";
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchApi } from "src/utils/api";
import { formatTweetDate } from "src/utils/formatters";
import {
  ArticlesIcon,
  LikeIcon,
  ReplyIcon,
  RetweetIcon,
  ShareIcon,
  TwitterIcon,
  YoutubeIcon,
} from "../../icons";
// import { AutoComplete } from "./AutoComplete";

interface SavedPost {
  id: number;
  post_id: string;
  type: "twitter";
}

interface TweetHome {
  id: number;
  text: string;
  created_at: Dayjs;
  author: {
    name: string;
    username: string;
    profile_image_url: string;
  };
  public_metrics: {
    like_count: number;
    quote_count: number;
    reply_count: number;
    retweet_count: number;
  };
}

interface NewTweetModalProps {
  isOpen: boolean;
  addTweet: (text: string) => Promise<void>;
  onClose: () => void;
}

interface PublicMetricsItemProps {
  count: string;
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

const PublicMetricsItem: React.FC<PublicMetricsItemProps> = ({
  count,
  children,
}) => {
  return (
    <Flex flex={1} alignItems={"center"} pr="8">
      {children}
      {count !== "0" && (
        <Text ml="3" color={"gray.500"} fontSize={"sm"}>
          {count}
        </Text>
      )}
    </Flex>
  );
};

const TweetCard: React.FC<{ post: SavedPost }> = ({ post }) => {
  const [tweet, setTweet] = useState<TweetHome>();

  useEffect(() => {
    (async () => {
      const tweetResponse = await fetchApi("/post", {
        queryParams: { id: post.id.toString(), type: post.type },
      });

      setTweet({
        ...tweetResponse.data,
        created_at: dayjs(tweetResponse?.created_at),
      });
    })();
  }, [post.id, post.post_id, post.type]);

  return (
    <Box w="100%" borderRadius="xl" mb={"8"} d="inline-block">
      {tweet && (
        <Flex alignItems={"start"}>
          <Image
            src={tweet.author.profile_image_url}
            alt="profile"
            borderRadius={"3xl"}
          />
          <Box w={"100%"}>
            <Flex alignItems={"center"} ml="3">
              <Text fontWeight={"semibold"}>{tweet.author.name} </Text>
              <Text
                color={"gray.500"}
                fontSize={"sm"}
                fontWeight={"medium"}
                ml="2"
              >
                @{tweet.author.username}
              </Text>
              <Text
                mx="1"
                color={"gray.500"}
                fontSize={"xx-small"}
                fontWeight={"medium"}
              >
                •
              </Text>
              <Text color={"gray.500"} fontSize={"sm"} fontWeight={"medium"}>
                {formatTweetDate(tweet.created_at)}
              </Text>
            </Flex>
            <Text ml="3" mb="4" whiteSpace={"pre-wrap"}>
              {tweet.text}
            </Text>
            <Flex ml="6">
              <PublicMetricsItem
                count={`${
                  tweet.public_metrics.quote_count +
                  tweet.public_metrics.retweet_count
                }`}
              >
                <RetweetIcon />
              </PublicMetricsItem>
              <PublicMetricsItem count={`${tweet.public_metrics.like_count}`}>
                <LikeIcon />
              </PublicMetricsItem>
              <PublicMetricsItem count={`${tweet.public_metrics.reply_count}`}>
                <ReplyIcon />
              </PublicMetricsItem>
              <PublicMetricsItem count="">
                <ShareIcon />
              </PublicMetricsItem>
            </Flex>
          </Box>
        </Flex>
      )}
    </Box>
  );
};

const NewTweetModal: React.FC<NewTweetModalProps> = ({
  isOpen,
  addTweet,
  onClose,
}) => {
  const [tweetUrl, setTweetUrl] = useState("");

  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  // const [newOptions, setNewOptions] = useState<string[]>([]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        onClose();
        setSelectedOptions([]);
      }}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add Tweet</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Input
            value={tweetUrl}
            placeholder="https://twitter.com/hey_yogini/status/1482423775283286016?s=20"
            onChange={(event) => {
              setTweetUrl(event.target.value);
            }}
          />
          <Wrap mt="16">
            {selectedOptions.map((each, idx) => (
              <Tag key={idx}>
                <TagLabel>{each}</TagLabel>
                <TagCloseButton
                  onClick={() => {
                    setSelectedOptions(
                      selectedOptions.filter((_, index) => idx !== index)
                    );
                    // TODO remove from options if its not used anywhere else
                  }}
                />
              </Tag>
            ))}
          </Wrap>
          {/* <AutoComplete
            options={tags[0]}
            onSelect={(name) => {
              if (!selectedOptions.includes(name)) {
                setSelectedOptions([...selectedOptions, name]);
              }
              if (!tags[0].tags.find((tag) => tag.name === name)) {
                // createTagMutation({ name })
                setNewOptions([...newOptions, name]);
              }
            }}
          /> */}
        </ModalBody>

        <ModalFooter>
          <Button
            variant="ghost"
            onClick={() => {
              onClose();
              setSelectedOptions([]);
            }}
            mr={4}
          >
            Cancel
          </Button>
          <Button
            colorScheme="blue"
            mr={3}
            onClick={async () => {
              await addTweet(tweetUrl);
              onClose();
              setSelectedOptions([]);
            }}
          >
            Add
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

const Home: React.FC = () => {
  const [twitterChecked, setTwitterChecked] = useState(true);
  const [articlesChecked, setArticlesChecked] = useState(true);
  const [youtubeChecked, setYoutubeChecked] = useState(true);

  const [search, setSearch] = useState("");
  const [posts, setPosts] = useState<SavedPost[]>([]);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const addTweet = useCallback(
    async (url: string) => {
      const post = await fetchApi("/posts/create", {
        method: "POST",
        body: { url },
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
        const response = await fetchApi("/posts");
        if (response.key === "unauthenticated") {
          navigate("/auth", { replace: true });
        }
        setPosts(response);
      } catch (e) {
        console.log(e);
      }
    })();
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
          <Button onClick={onOpen} mt="4" size={"lg"}>
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
          <Box width={"100%"} sx={{ columnCount: [1, 2], columnGap: "8px" }}>
            {posts.map((post, idx) => (
              <TweetCard key={idx} post={post} />
            ))}
          </Box>
        )}
      </Box>
      <NewTweetModal
        isOpen={isOpen}
        onClose={() => {
          onClose();
        }}
        addTweet={addTweet}
      />
    </Flex>
  );
};

export default Home;
