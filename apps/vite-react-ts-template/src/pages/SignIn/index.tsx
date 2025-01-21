import { Center } from "@chakra-ui/react";

import { Page } from "shared/Layout";
import { ErrorPageStrategy } from "shared/Result";

import { withRequirePub } from "modules/auth/application";
import { SignInForm } from "modules/auth/presentation";

export const SignInPage = () => {
  return (
    <Page maxW="container.xl">
      <Center py={{ base: 10, md: 12 }}>
        <SignInForm
          initialUsername="neb.vojvodic@gmail.com"
          initialPassword="83r5^_"
        />
      </Center>
    </Page>
  );
};

export const Component = withRequirePub(SignInPage, { to: "/reservations" });

export const ErrorBoundary = ErrorPageStrategy;
