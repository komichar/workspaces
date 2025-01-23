import { useState } from "react";

import {
  Badge,
  Box,
  Button,
  Heading,
  HStack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  UnorderedList,
  useClipboard,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";

import { ArrowForwardIcon, CheckIcon, CopyIcon } from "@chakra-ui/icons";
import { IconButton, Tooltip } from "@chakra-ui/react";

import { TextInput } from "shared/Form";

import type { User } from "../../../../../api/src/user";
import { useAuthStore } from "../application";
import { useUsersQuery } from "../infrastructure";
import { useSignInNotifications } from "./useSignInNotifications";
import { useOfficesQuery } from "modules/offices/infrastructure";
import { useOfficesUsersQuery } from "modules/offices-users/infrastructure/officesUsersQuery";

interface IProps {
  initialUsername?: string;
  initialPassword?: string;
}

export const SignInForm = ({
  initialUsername = "",
  initialPassword = "",
}: IProps) => {
  const [username, setUsername] = useState(initialUsername);
  const [password, setPassword] = useState(initialPassword);

  const users = useUsersQuery();
  const offices = useOfficesQuery();

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
            Use existing users to sign in
          </Heading>

          {offices.data && (
            <Tabs variant="enclosed">
              <TabList>
                {offices.data.offices.map((office) => (
                  <Tab key={office.id}>{office.city} office</Tab>
                ))}
              </TabList>

              <TabPanels>
                {offices.data.offices.map((office) => (
                  <TabPanel key={office.id}>
                    <OfficeUsersUnorderedList
                      office_id={office.id}
                      onSignInClick={(email) =>
                        login({ username: email, password })
                          .then(() => notifySuccess())
                          .catch(() => notifyFailure())
                      }
                    ></OfficeUsersUnorderedList>
                  </TabPanel>
                ))}
              </TabPanels>
            </Tabs>
          )}
        </VStack>
      </VStack>
    </>
  );
};

type OfficeUsersProps = {
  onSignInClick: (email: string) => void;
  office_id: number;
};

function OfficeUsersUnorderedList({
  office_id,
  onSignInClick,
}: OfficeUsersProps) {
  const officesUsers = useOfficesUsersQuery(office_id);
  if (!officesUsers.data) {
    return null;
  }

  return (
    <UnorderedList>
      <Text color="gray.500">
        {officesUsers.data.length} users work in this office
      </Text>
      {officesUsers.data.map((user) => (
        <ExistingUser
          key={user.id}
          user={user}
          onSignInClick={() => onSignInClick(user.email)}
        ></ExistingUser>
      ))}
    </UnorderedList>
  );
}

type Props = {
  user: User;
  onSignInClick: (email: string) => void;
};

function ExistingUser({ user, onSignInClick }: Props) {
  const { onCopy, hasCopied } = useClipboard(user.email);
  const secondaryColor = useColorModeValue("gray.600", "gray.400");

  return (
    <Box display="flex" py={2} alignItems="center" gap={3}>
      {/* Copy Email Button */}
      <Tooltip label={hasCopied ? "Email copied!" : "Copy email"} fontSize="sm">
        <IconButton
          aria-label="Copy email"
          icon={hasCopied ? <CheckIcon /> : <CopyIcon />}
          onClick={onCopy}
          size="sm"
          variant="outline"
        />
      </Tooltip>

      <Tooltip
        label={hasCopied ? "Email copied!" : "Sign in as this user"}
        fontSize="sm"
      >
        <IconButton
          aria-label="Sign in as this user"
          icon={hasCopied ? <CheckIcon /> : <ArrowForwardIcon />}
          onClick={() => onSignInClick(user.email)}
          size="sm"
          colorScheme="blue"
          variant="outline"
        />
      </Tooltip>

      {/* Email Address */}
      <Text fontWeight="medium" color={secondaryColor} flex="1">
        {user.email}
      </Text>

      <Badge>Id: {user.id}</Badge>

      {/* User Role */}
      <Badge colorScheme={user.admin ? "green" : "blue"}>
        {user.admin ? "Admin" : "Regular"}
      </Badge>
    </Box>
  );
}
