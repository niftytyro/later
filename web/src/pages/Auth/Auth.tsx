import {
  Box,
  Flex,
  Heading,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Login from "./Login";
import Signup from "./Signup";

const Auth: React.FC = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  return (
    <Flex h="100%" mt="32" flexDir={"column"} alignItems="center">
      <Heading mb="8">Authentication</Heading>
      <Tabs w={"30%"} isFitted>
        <TabList>
          <Tab>Login</Tab>
          <Tab>Signup</Tab>
        </TabList>
        <Box h="4" />
        <TabPanels>
          <TabPanel>
            <Login
              onLogin={() => {
                navigate("/", { replace: true });
              }}
              email={email}
              emailError={emailError}
              password={password}
              passwordError={passwordError}
              setEmail={(newEmail) => {
                setEmailError("");
                setEmail(newEmail);
              }}
              setEmailError={setEmailError}
              setPassword={(newPassword) => {
                setPasswordError("");
                setPassword(newPassword);
              }}
              setPasswordError={setPasswordError}
            />
          </TabPanel>
          <TabPanel>
            <Signup
              onSignup={() => {
                navigate("/", { replace: true });
              }}
              email={email}
              emailError={emailError}
              name={name}
              nameError={nameError}
              password={password}
              passwordError={passwordError}
              setEmail={(newEmail) => {
                setEmailError("");
                setEmail(newEmail);
              }}
              setEmailError={setEmailError}
              setName={(newName) => {
                setNameError("");
                setName(newName);
              }}
              setNameError={setNameError}
              setPassword={(newPassword) => {
                setPasswordError("");
                setPassword(newPassword);
              }}
              setPasswordError={setPasswordError}
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Flex>
  );
};

export default Auth;
