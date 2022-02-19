import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Tag as TagContainer,
  TagCloseButton,
  TagLabel,
  Wrap,
} from "@chakra-ui/react";
import React from "react";
import { useState } from "react";
import { AutoComplete } from "./AutoComplete";
import { Tag } from "./Home";

interface NewTweetModalProps {
  isOpen: boolean;
  tags: Tag[];
  addTweet: (text: string, tags: string[]) => Promise<void>;
  onClose: () => void;
}

export const NewTweetModal: React.FC<NewTweetModalProps> = ({
  isOpen,
  addTweet,
  onClose,
  tags,
}) => {
  const [tweetUrl, setTweetUrl] = useState("");

  const [options, setOptions] = useState<string[]>([]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        onClose();
        setOptions([]);
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
            {options.map((option, idx) => (
              <TagContainer key={idx}>
                <TagLabel>{option}</TagLabel>
                <TagCloseButton
                  onClick={() => {
                    setOptions(options.filter((_, index) => idx !== index));
                  }}
                />
              </TagContainer>
            ))}
          </Wrap>
          <AutoComplete
            tags={tags}
            onSelect={(name) => {
              if (!options.includes(name) && name.trim().length) {
                setOptions([...options, name]);
              }
            }}
          />
        </ModalBody>

        <ModalFooter>
          <Button
            variant="ghost"
            onClick={() => {
              onClose();
              setOptions([]);
            }}
            mr={4}
          >
            Cancel
          </Button>
          <Button
            colorScheme="blue"
            mr={3}
            onClick={async () => {
              await addTweet(tweetUrl, options);
              onClose();
              setOptions([]);
            }}
          >
            Add
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
