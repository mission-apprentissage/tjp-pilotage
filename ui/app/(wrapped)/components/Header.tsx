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
  Portal,
  useToken,
  VStack,
} from "@chakra-ui/react";
import { useQueryClient } from "@tanstack/react-query";
import NextLink from "next/link";
import { useContext } from "react";

import { client } from "@/api.client";
import { AuthContext } from "@/app/(wrapped)/auth/authContext";
import { CodeDepartementFilterContext, CodeRegionFilterContext, UaisFilterContext } from "@/app/layoutClient";

import { InformationHeader } from "./InformationHeader";
import { Nav } from "./Nav";

export const Header = ({ isMaintenance }: { isMaintenance?: boolean }) => {
  const { auth, setAuth } = useContext(AuthContext);
  const { setUaisFilter } = useContext(UaisFilterContext);
  const { setCodeDepartementFilter } = useContext(CodeDepartementFilterContext);
  const { setCodeRegionFilter } = useContext(CodeRegionFilterContext);
  const queryClient = useQueryClient();

  const logout = async () => {
    await client.ref("[POST]/auth/logout").query({});
    setAuth(undefined);
    setUaisFilter(undefined);
    setCodeDepartementFilter(undefined);
    setCodeRegionFilter(undefined);
    queryClient.clear();
  };

  const greyColor = useToken("colors", "grey.900");

  return (
    <>
      <VStack
        zIndex="docked"
        spacing="0"
        divider={<Box width="100%" borderBottom="1px solid" borderBottomColor="grey.900" />}
        align={"start"}
        borderBottom={`1px solid ${greyColor}`}
      >
        <Flex align="center" as={Container} py={2} maxWidth={"container.xl"}>
          <HStack as={Link} spacing={1} align="center" href="/">
            <Flex direction={"row"} gap={6}>
              <Img height="70px" src="/logo_gouvernement.svg" alt="Logo république Française" />
              <Img height="60px" src="/logo_orion.svg" alt="Logo Orion" my={"auto"} />
            </Flex>
            <Heading as={"h1"} size={"md"}>
              <Box as="span" display={["none", null, "unset"]}>
                Outil d’aide à la transformation de la carte des formations
              </Box>
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
              <Menu isLazy autoSelect={false} placement="bottom-end">
                <MenuButton ml="auto" as={Button} fontWeight="light" color="bluefrance.113" variant="ghost">
                  <Box as="span" display={["none", null, "unset"]}>
                    Bienvenue,{" "}
                  </Box>
                  {auth.user.email}
                  <ChevronDownIcon ml="2" />
                </MenuButton>
                <Portal>
                  <MenuList zIndex={"dropdown"}>
                    <MenuItem onClick={logout}>
                      <LoginIcon me={2} />
                      Se déconnecter
                    </MenuItem>
                  </MenuList>
                </Portal>
              </Menu>
            )}
          </Box>
        </Flex>
      </VStack>
      {!isMaintenance && (
        <Box boxShadow="0 2px 3px rgba(0,0,18,0.16)" position="sticky" top={0} zIndex="docked" backgroundColor="white">
          <Container maxWidth={"container.xl"} px={0}>
            <Nav />
          </Container>
        </Box>
      )}
      <InformationHeader />
    </>
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
