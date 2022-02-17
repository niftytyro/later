import { Box, Button } from "@chakra-ui/react";
import React, { useCallback } from "react";
import Input from "src/components/Input";
import { fetchApi } from "src/utils/api";

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
    const response = await fetchApi("/auth/login", {
      method: "POST",
      body: { email, password },
    });

    switch (response.key) {
      case "email":
        setEmailError(response.message);
        break;
      case "password":
        setPasswordError(response.message);
        break;
      case "success":
        onLogin();
        break;
      default:
        break;
    }
  }, [email, onLogin, password, setEmailError, setPasswordError]);

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
