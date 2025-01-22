import { useState } from "react";

import {
  Badge,
  Box,
  Button,
  Heading,
  Text,
  UnorderedList,
  useClipboard,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { useSecondaryTextColor } from "theme";

import { TextInput } from "shared/Form";

import type { User } from "../../../../../api/user";
import { useAuthStore } from "../application";
import { useUsersQuery } from "../infrastructure";
import { useSignInNotifications } from "./useSignInNotifications";

interface IProps {
  initialUsername?: string;
  initialPassword?: string;
}

export const SignInForm = ({ initialUsername, initialPassword }: IProps) => {
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
                <ExistingUser key={user.id} user={user}></ExistingUser>
              ))}
            </UnorderedList>
          )}
        </VStack>
      </VStack>
    </>
  );
};

type Props = {
  user: User;
};

function ExistingUser({ user }: Props) {
  const secondaryColor = useSecondaryTextColor();
  const { onCopy, hasCopied } = useClipboard(user.email);

  return (
    <Box display="flex" py={2} alignItems="center">
      <Button mr={2} size="xs" onClick={onCopy}>
        {hasCopied ? "Copied!" : "Copy"}
      </Button>
      <Text mr={2} color={secondaryColor}>
        {user.email}{" "}
      </Text>
      <Box display="inline-block">
        {user.admin ? (
          <Badge colorScheme="green">Admin</Badge>
        ) : (
          <Badge>Regular</Badge>
        )}
      </Box>
    </Box>
  );
}
