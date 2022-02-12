import { Box, Button } from "@chakra-ui/react";
import React, { useCallback } from "react";
import Input from "src/components/Input";
import { getRequestHeaders } from "src/utils/api";
import { LoginFormProps } from "./Login";

interface SignupFormProps extends Omit<LoginFormProps, "onLogin"> {
  name: string;
  nameError: string;
  setName: (email: string) => void;
  setNameError: React.Dispatch<React.SetStateAction<string>>;
  onSignup: () => void;
}

const Signup: React.FC<SignupFormProps> = ({
  email,
  emailError,
  name,
  nameError,
  password,
  passwordError,
  setEmail,
  setEmailError,
  setName,
  setNameError,
  setPassword,
  setPasswordError,
  onSignup,
}) => {
  const signup = useCallback(async () => {
    setNameError("");
    setEmailError("");
    setPasswordError("");
    const response = await fetch("http://localhost:8000/auth/signup", {
      method: "POST",
      headers: getRequestHeaders(),
      credentials: "include",
      body: JSON.stringify({
        name,
        email,
        password,
      }),
    });
    const message = await response.json();
    switch (message.key) {
      case "email":
        setEmailError(message.message);
        break;
      case "name":
        setNameError(message.message);
        break;
      case "password":
        setPasswordError(message.message);
        break;
      case "success":
        onSignup();
        break;
      default:
        break;
    }
  }, [
    email,
    name,
    onSignup,
    password,
    setEmailError,
    setNameError,
    setPasswordError,
  ]);

  return (
    <>
      <Input label="Name" value={name} setValue={setName} error={nameError} />
      <Box h="4" />
      <Input
        label="Email"
        value={email}
        setValue={setEmail}
        error={emailError}
      />
      <Box h="4" />
      <Input
        label="Password"
        value={password}
        setValue={setPassword}
        error={passwordError}
        type="password"
      />
      <Box h="8" />
      <Button onClick={signup} display="block" ml="auto">
        Signup
      </Button>
    </>
  );
};

export default Signup;
