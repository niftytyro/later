import { Box, Button } from "@chakra-ui/react";
import React, { useCallback } from "react";
import Input from "src/components/Input";
import { fetchApi } from "src/utils/api";
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
    const response = await fetchApi("/auth/signup", {
      method: "POST",
      body: { name, email, password },
    });
    switch (response.key) {
      case "email":
        setEmailError(response.message);
        break;
      case "name":
        setNameError(response.message);
        break;
      case "password":
        setPasswordError(response.message);
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
