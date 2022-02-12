import { Box, Button } from "@chakra-ui/react";
import Input from "src/components/Input";
import React, { useCallback, useState } from "react";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = useCallback(() => {
    fetch("localhost:8000/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
      }),
    });
  }, [email, password]);

  return (
    <>
      <Input label="Email" value={email} setValue={setEmail} />
      <Box h="4" />
      <Input label="Password" value={password} setValue={setPassword} />
      <Box h="8" />
      <Button onClick={login} display="block" ml="auto">
        Login
      </Button>
    </>
  );
};

export default Login;
