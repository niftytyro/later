import { AddIcon, CheckIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  Input,
  Spacer,
  Tag as TagContainer,
  TagCloseButton,
  TagLabel,
} from "@chakra-ui/react";
import React, { useState } from "react";

interface PostProps {
  tags: string[];
  setTags: React.Dispatch<React.SetStateAction<string[]>>;
  removeTag: (idx: number) => void;
  addTag: (newTag: string) => void;
  markAsRead: () => void;
}

export const Post: React.FC<PostProps> = ({
  children,
  tags,
  setTags,
  removeTag,
  addTag,
  markAsRead,
}) => {
  const [newTag, setNewTag] = useState<string | null>(null);

  return (
    <Box w="100%" mb={"8"} d="inline-block">
      {tags && children && (
        <Box borderRadius="xl" border={"1px"} borderColor="whiteAlpha.300">
          {children}
          <Flex
            width={"100%"}
            bg={"gray.700"}
            alignItems="center"
            borderBottomRadius={"xl"}
            px="4"
            py="2"
          >
            {tags.map((tag, idx) => (
              <TagContainer size="lg" key={idx} mr="2">
                <TagLabel fontSize={"sm"}>{tag}</TagLabel>
                <TagCloseButton
                  onClick={() => {
                    removeTag(idx);
                  }}
                />
              </TagContainer>
            ))}
            {newTag !== null && (
              <Input
                autoFocus
                size={"sm"}
                p="8px"
                width={`${(newTag.length + 2.5) * 8}px`}
                value={newTag}
                onChange={(e) => {
                  setNewTag(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    addTag(newTag);
                    setNewTag(null);
                  } else if (e.key === "Escape") {
                    setNewTag(null);
                  }
                }}
              />
            )}
            <Button
              leftIcon={<AddIcon />}
              colorScheme="gray"
              size={"sm"}
              variant="outline"
              mr={3}
              onClick={() => {
                setNewTag("");
              }}
            >
              Add Tag
            </Button>
            <Spacer />
            <Button
              colorScheme={"teal"}
              size={"sm"}
              bg={"green.600"}
              _hover={{ background: "green.700" }}
              textColor="white"
              leftIcon={<CheckIcon />}
              onClick={markAsRead}
            >
              Mark as read
            </Button>
          </Flex>
        </Box>
      )}
    </Box>
  );
};
