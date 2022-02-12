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
import React from "react";
import Login from "./Login";
import Signup from "./Signup";

const Auth: React.FC = () => {
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
            <Login />
          </TabPanel>
          <TabPanel>
            <Signup />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Flex>
  );
};

export default Auth;
