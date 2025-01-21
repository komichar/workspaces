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
} from "@chakra-ui/react";
import { useSecondaryTextColor } from "theme";

import { TextInput } from "shared/Form";

import { useAuthStore } from "../application";
import { useSignInNotifications } from "./useSignInNotifications";

interface IProps {
  initialUsername?: string;
  initialPassword?: string;
}

export const SignInForm = ({ initialUsername, initialPassword }: IProps) => {
  const secondaryColor = useSecondaryTextColor();

  const [username, setUsername] = useState(initialUsername);
  const [password, setPassword] = useState(initialPassword);

  const [notifySuccess, notifyFailure] = useSignInNotifications();
  const login = useAuthStore((store) => store.login);

  return (
    <VStack align="stretch" spacing={8} w="100%" maxW="lg">
      <VStack textAlign="center">
        <Heading fontSize={{ base: "2xl", md: "4xl" }}>
          Sign in to your account
        </Heading>
        <Text fontSize={{ base: "md", md: "lg" }} color={secondaryColor}>
          to enjoy all of our cool <Link color={"blue.400"}>features</Link> ✌️
        </Text>
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
            Password
          </TextInput>
          <VStack w="100%" spacing={10}>
            <Stack
              w="100%"
              direction={{ base: "column", sm: "row" }}
              align="start"
              justify="space-between"
            >
              <Checkbox>Remember me</Checkbox>
              <Link color="blue.400">Forgot password?</Link>
            </Stack>
            <Button type="submit" colorScheme="blue" w="100%">
              Sign in
            </Button>
          </VStack>
        </VStack>
      </Box>
    </VStack>
  );
};
