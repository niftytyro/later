import React, { useState } from "react";
import {
  Box,
  Input as ChakraInput,
  InputGroup,
  InputRightAddon,
  Text,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";

interface InputProps {
  error?: string;
  label: string;
  value: string;
  type?: "text" | "password";
  setValue: React.Dispatch<React.SetStateAction<string>>;
}

const Input: React.FC<InputProps> = ({
  error,
  label,
  type,
  value,
  setValue,
}) => {
  const [show, setShow] = useState(!(type === "password"));

  return (
    <Box w={"100%"}>
      <Text mb="2" ml="1">
        {label}
      </Text>
      <InputGroup>
        <ChakraInput
          placeholder={label}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          isInvalid={!!error}
          type={show ? "text" : "password"}
        />
        {type === "password" && (
          <InputRightAddon onClick={() => setShow(!show)}>
            {show ? <ViewIcon /> : <ViewOffIcon />}
          </InputRightAddon>
        )}
      </InputGroup>
      <Text color={"red.400"}>{error ?? ""}</Text>
    </Box>
  );
};

export default Input;
