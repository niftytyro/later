import React from "react";
import { Box, Input as ChakraInput, Text } from "@chakra-ui/react";

interface InputProps {
  label: string;
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
}

const Input: React.FC<InputProps> = ({ label, value, setValue }) => {
  return (
    <Box w={"100%"}>
      <Text mb="2" ml="1">
        {label}
      </Text>
      <ChakraInput
        placeholder={label}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </Box>
  );
};

export default Input;
