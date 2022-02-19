import { Box, Flex, Image, Text } from "@chakra-ui/react";
import dayjs, { Dayjs } from "dayjs";
import React, { useCallback, useEffect, useState } from "react";
import { fetchApi } from "src/utils/api";
import { formatTweetDate } from "src/utils/formatters";
import { LikeIcon, ReplyIcon, RetweetIcon, ShareIcon } from "../../icons";
import { Tag } from "./Home";
import { Post } from "./Post";

export interface SavedPost {
  id: number;
  post_id: string;
  type: "twitter";
}

interface TweetHome {
  id: number;
  post_id: string;
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
  tags: Tag[];
}

interface PublicMetricsItemProps {
  count: string;
}

export const TweetCard: React.FC<{
  post: SavedPost;
}> = ({ post }) => {
  const [tweet, setTweet] = useState<TweetHome>();
  const [tags, setTags] = useState<string[]>([]);

  const update = useCallback(async () => {
    if (!!tweet) {
      await fetchApi("/posts/update", {
        method: "POST",
        body: { id: tweet?.id, tags },
      });
    }
  }, [tags, tweet]);

  const removeTag = useCallback(
    (idx: number) => {
      setTags(tags.filter((_, index) => idx !== index));
    },
    [tags]
  );

  const fetchTweet = useCallback(async () => {
    const tweetResponse = await fetchApi("/post", {
      queryParams: { id: post.id.toString(), type: post.type },
    });

    setTweet({
      ...tweetResponse.data,
      created_at: dayjs(tweetResponse?.created_at),
    });
    setTags(tweetResponse.data.tags.map((each: Tag) => each.name));
  }, [post.id, post.type]);

  useEffect(() => {
    fetchTweet();
  }, [fetchTweet]);

  useEffect(() => {
    update();
  }, [tags, update]);

  return (
    <Post tags={tags} setTags={setTags} removeTag={removeTag}>
      {tweet && (
        <Flex alignItems={"start"} p="4">
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
    </Post>
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
