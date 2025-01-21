import { useState } from "react";

import {
  Box,
  Checkbox,
  Stack,
  Link,
  Button,
  Heading,
  Text,
  useColorModeValue,
  VStack,
  ListItem,
  UnorderedList,
} from "@chakra-ui/react";
import { useSecondaryTextColor } from "theme";

import { TextInput } from "shared/Form";

import { useAuthStore } from "../application";
import { useSignInNotifications } from "./useSignInNotifications";
import { useUsersQuery } from "../infrastructure";

interface IProps {
  initialUsername?: string;
  initialPassword?: string;
}

export const SignInForm = ({ initialUsername, initialPassword }: IProps) => {
  const secondaryColor = useSecondaryTextColor();

  const [username, setUsername] = useState(initialUsername);
  const [password, setPassword] = useState(initialPassword);

  const users = useUsersQuery();

  const [notifySuccess, notifyFailure] = useSignInNotifications();
  const login = useAuthStore((store) => store.login);

  return (
    <>
      <VStack align="stretch" spacing={8} w="100%" maxW="lg">
        <VStack textAlign="center">
          <Heading fontSize={{ base: "2xl", md: "4xl" }}>
            Sign in to your account
          </Heading>
        </VStack>
        <Box
          rounded="lg"
          bg={useColorModeValue("white", "gray.700")}
          boxShadow="lg"
          p={{ base: 6, md: 8 }}
        >
          <VStack
            as="form"
            spacing={4}
            onSubmit={(e) => {
              e.preventDefault();

              if (!username || !password) {
                return;
              }

              login({ username, password })
                .then(() => notifySuccess())
                .catch(() => notifyFailure());
            }}
          >
            <TextInput
              id="username"
              value={username}
              onChange={(e) => setUsername(e.currentTarget.value)}
            >
              Username
            </TextInput>
            <TextInput
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.currentTarget.value)}
            >
              Password (doesn't matter)
            </TextInput>
            <VStack w="100%" spacing={10}>
              <Button type="submit" colorScheme="blue" w="100%">
                Sign in
              </Button>
            </VStack>
          </VStack>
        </Box>

        <VStack textAlign="left">
          <Heading fontSize={{ base: "2xl", md: "4xl" }}>
            Existing users
          </Heading>

          {users.data && (
            <UnorderedList>
              {users.data.map((user) => (
                <ListItem key={user.id}>
                  <Text color={secondaryColor}>{user.email}</Text>
                </ListItem>
              ))}
            </UnorderedList>
          )}
        </VStack>
      </VStack>
    </>
  );
};
