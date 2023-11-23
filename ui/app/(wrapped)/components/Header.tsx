"use client";

import { ChevronDownIcon } from "@chakra-ui/icons";
import { Link } from "@chakra-ui/next-js";
import {
  Box,
  Button,
  Container,
  createIcon,
  Flex,
  Heading,
  HStack,
  Img,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  VStack,
} from "@chakra-ui/react";
import { useQueryClient } from "@tanstack/react-query";
import NextLink from "next/link";
import { useContext } from "react";

import { client } from "@/api.client";
import { AuthContext } from "@/app/(wrapped)/auth/authContext";

import { Nav } from "./Nav";

export const Header = () => {
  const { auth, setAuth } = useContext(AuthContext);
  const queryClient = useQueryClient();

  const logout = async () => {
    await client.ref("[POST]/auth/logout").query({});
    setAuth(undefined);
    queryClient.clear();
  };
  return (
    <VStack
      zIndex={1}
      spacing="0"
      divider={
        <Box
          width="100%"
          borderBottom="1px solid"
          borderBottomColor="grey.900"
        />
      }
      align={"start"}
      boxShadow="0 2px 3px rgba(0,0,18,0.16)"
    >
      <Flex align="center" as={Container} py={2} maxWidth={"container.xl"}>
        <HStack as={Link} spacing={10} align="center" href="/">
          <Img height="70px" src="/logo_gouvernement.svg" />
          <Heading as={"h1"} size={"md"}>
            Orion, outil d’aide à la transformation de la carte des formations
          </Heading>
        </HStack>
        <Box ml="auto">
          {!auth && (
            <Button
              fontWeight="light"
              as={NextLink}
              ml="auto"
              color="bluefrance.113"
              href="/auth/login"
              variant="ghost"
            >
              <LoginIcon mr="2" />
              Se connecter
            </Button>
          )}
          {!!auth && (
            <Menu isLazy autoSelect={false} placement="bottom-end" id={"1"}>
              <MenuButton
                ml="auto"
                as={Button}
                fontWeight="light"
                color="bluefrance.113"
                variant="ghost"
              >
                Bienvenue, {auth.user.email}
                <ChevronDownIcon ml="2" />
              </MenuButton>
              <MenuList>
                <MenuItem onClick={logout} icon={<LoginIcon />}>
                  Se déconnecter
                </MenuItem>
              </MenuList>
            </Menu>
          )}
        </Box>
      </Flex>
      <Container maxWidth={"container.xl"}>
        <Nav />
      </Container>
    </VStack>
  );
};

const LoginIcon = createIcon({
  displayName: "loginIcon",
  viewBox: "0 0 24 24",
  defaultProps: {
    stroke: "currentcolor",
    fill: "none",
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  },
  path: (
    <>
      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
      <polyline points="10 17 15 12 10 7"></polyline>
      <line x1="15" x2="3" y1="12" y2="12"></line>
    </>
  ),
});
