import { CloseIcon, HamburgerIcon } from "@chakra-ui/icons";
import {
  Badge,
  Box,
  Button,
  Collapse,
  Flex,
  HStack,
  IconButton,
  Text,
  useBreakpointValue,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";

import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Tooltip,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

import { Link } from "shared/Router";
import { useNotImplementedYetToast } from "shared/Toast";

import { useAuthStore } from "modules/auth/application";

import { ToggleModeButton } from "../ToggleModeButton";
import { DesktopNav } from "./DesktopNav";
import { LoaderBar } from "./LoaderBar";
import { MobileNav } from "./MobileNav";

export const Navbar = () => {
  const { isOpen, onToggle } = useDisclosure();
  const bg = useColorModeValue("white", "gray.800");

  return (
    <Box w="100%" position="fixed" zIndex="10">
      <Flex
        w="100%"
        minH="60px"
        py={2}
        px={4}
        borderBottom={1}
        borderStyle="solid"
        borderColor={useColorModeValue("gray.200", "gray.900")}
        align="center"
        bg={bg}
      >
        <Flex
          flex={{ base: 1, md: "auto" }}
          display={{ base: "flex", md: "none" }}
        >
          <IconButton
            onClick={onToggle}
            icon={
              isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />
            }
            variant="ghost"
            aria-label="Toggle Navigation"
          />
        </Flex>
        <Flex flex={{ base: 1 }} justify={{ base: "center", md: "start" }}>
          <Text
            as={Link}
            to="/"
            textAlign={useBreakpointValue({ base: "center", md: "left" })}
            fontWeight="extrabold"
          >
            Reservation System
          </Text>
          <Flex display={{ base: "none", md: "flex" }} ml={10}>
            <DesktopNav />
          </Flex>
        </Flex>
        <HStack direction={"row"} spacing={4}>
          <SignInButton />
          <LogoutButton />
          <ToggleModeButton />
        </HStack>
      </Flex>
      <LoaderBar />
      <Collapse in={isOpen} animateOpacity>
        <MobileNav />
      </Collapse>
    </Box>
  );
};

const SignInButton = () => {
  const isAuthenticated = useAuthStore((store) => store.isAuthenticated);

  if (isAuthenticated) {
    return null;
  }

  return (
    <Button fontWeight={400} variant="link" as={Link} to="/sign-in">
      Sign In
    </Button>
  );
};

const SignUpButton = () => {
  const notImplemented = useNotImplementedYetToast();
  const isAuthenticated = useAuthStore((store) => store.isAuthenticated);

  if (isAuthenticated) {
    return null;
  }

  return (
    <Button
      display={{ base: "none", md: "inline-flex" }}
      colorScheme="orange"
      onClick={notImplemented}
    >
      Sign Up
    </Button>
  );
};

const LogoutButton = () => {
  const navigate = useNavigate();

  const { isAuthenticated, user } = useAuthStore((store) => ({
    isAuthenticated: store.isAuthenticated,
    user: store.user,
  }));
  const logout = useAuthStore((store) => store.logout);

  if (!isAuthenticated) {
    return null;
  }

  if (!user) {
    return null;
  }

  return (
    <Box display="flex" alignItems="center" gap={3}>
      <Tooltip label={`Logged in as ${user.email}`} fontSize="sm">
        <Avatar name={user.email} size="sm" />
      </Tooltip>
      <Box>
        <Text fontWeight="medium">{user.email}</Text>
        <Box display="flex" gap={2} mt={1}>
          <Badge colorScheme="purple">ID: {user.id}</Badge>
          <Badge colorScheme={user.admin ? "green" : "blue"}>
            {user.admin ? "Admin" : "Regular"}
          </Badge>
        </Box>
      </Box>

      <Menu>
        <MenuButton
          as={Button}
          variant="ghost"
          size="sm"
          rightIcon={<ChevronDownIcon />}
        >
          My Account
        </MenuButton>
        <MenuList>
          <MenuItem isDisabled onClick={() => navigate("/profile")}>
            Profile
          </MenuItem>
          <MenuItem onClick={() => logout().then(() => navigate("/sign-in"))}>
            Logout
          </MenuItem>
        </MenuList>
      </Menu>
    </Box>
  );
};

export default LogoutButton;
