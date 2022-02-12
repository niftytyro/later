import { Box, Button } from "@chakra-ui/react";
import Input from "src/components/Input";
import React, { useCallback, useState } from "react";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signup = useCallback(async () => {
    fetch("http://localhost:8000/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        name,
        email,
        password,
      }),
    });
  }, [email, name, password]);

  return (
    <>
      <Input label="Name" value={name} setValue={setName} />
      <Box h="4" />
      <Input label="Email" value={email} setValue={setEmail} />
      <Box h="4" />
      <Input label="Password" value={password} setValue={setPassword} />
      <Box h="8" />
      <Button onClick={signup} display="block" ml="auto">
        Signup
      </Button>
    </>
  );
};

export default Signup;
