import { Box, Button } from "@chakra-ui/react";
import React, { useCallback } from "react";
import Input from "src/components/Input";
import { getRequestHeaders } from "src/utils/api";

export interface LoginFormProps {
  email: string;
  emailError: string;
  password: string;
  passwordError: string;
  setEmail: (email: string) => void;
  setEmailError: React.Dispatch<React.SetStateAction<string>>;
  setPassword: (email: string) => void;
  setPasswordError: React.Dispatch<React.SetStateAction<string>>;
  onLogin: () => void;
}

const Login: React.FC<LoginFormProps> = ({
  email,
  emailError,
  password,
  passwordError,
  setEmail,
  setEmailError,
  setPassword,
  setPasswordError,
  onLogin,
}) => {
  const login = useCallback(async () => {
    setEmailError("");
    setPasswordError("");
    const response = await fetch("http://localhost:8000/auth/login", {
      method: "POST",
      headers: getRequestHeaders(),
      credentials: "include",
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const error = await response.json();
    switch (error.key) {
      case "email":
        setEmailError(error.message);
        break;
      case "password":
        setPasswordError(error.message);
        break;
      case "success":
        onLogin();
        break;
      default:
        break;
    }
  }, [email, password, setEmailError, setPasswordError]);

  return (
    <>
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
      <Button onClick={login} display="block" ml="auto">
        Login
      </Button>
    </>
  );
};

export default Login;
