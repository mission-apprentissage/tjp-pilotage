"use client";

import { ChevronDownIcon } from "@chakra-ui/icons";
import {Box, Button, Container, createIcon, Flex, Heading, HStack, Img, Menu, MenuButton, MenuItem, MenuList, Portal, useDisclosure,useToken, VStack} from '@chakra-ui/react';
import { useQueryClient } from "@tanstack/react-query";
import NextLink from "next/link";
import { useContext } from "react";

import { client } from "@/api.client";
import { CodeDepartementContext } from "@/app/codeDepartementContext";
import { CodeRegionContext } from "@/app/codeRegionContext";
import { UaisContext } from "@/app/uaiContext";
import { useAuth } from "@/utils/security/useAuth";

import { InformationHeader } from "./InformationHeader";
import { Nav } from "./Nav";

export const Header = ({ isMaintenance }: { isMaintenance?: boolean }) => {
  const { auth, setAuth } = useAuth();
  const { setUais } = useContext(UaisContext);
  const { setCodeDepartement } = useContext(CodeDepartementContext);
  const { setCodeRegion } = useContext(CodeRegionContext);
  const queryClient = useQueryClient();

  const {
    isOpen: isMenuDeconnexionOpen,
    onOpen: onMenuDeconnexionOpen,
    onClose: onMenuDeconnexionClose
  } = useDisclosure();

  const logout = async () => {
    await client.ref("[POST]/auth/logout").query({});
    setAuth(undefined);
    setUais(undefined);
    setCodeDepartement(undefined);
    setCodeRegion(undefined);
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
          <HStack spacing={1} align="center">
            <Flex direction={"row"} gap={6}>
              <Img height="70px" src="/logo_gouvernement.svg" alt="Logo république Française 1" />
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
              <Menu autoSelect={false} placement="bottom-end" closeOnBlur  isOpen={isMenuDeconnexionOpen} gutter={0}>
                <MenuButton
                  ml="auto"
                  as={Button}
                  fontWeight="light"
                  color="bluefrance.113"
                  variant="ghost"
                  aria-expanded={isMenuDeconnexionOpen ? "true" : "false"}
                  onMouseEnter={onMenuDeconnexionOpen}
                  onMouseLeave={onMenuDeconnexionClose}
                >
                  <Box as="span" display={["none", null, "unset"]}>
                    Bienvenue,{" "}
                  </Box>
                  {auth.user.email}
                  <ChevronDownIcon ml="2" />
                </MenuButton>
                <Portal>
                  <MenuList
                    zIndex={"dropdown"}
                    borderTop="unset"
                    onMouseEnter={onMenuDeconnexionOpen}
                    onMouseLeave={onMenuDeconnexionClose}
                  >
                    <MenuItem autoFocus onClick={logout} >
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
