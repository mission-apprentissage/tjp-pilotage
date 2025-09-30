"use client";

import { ChevronDownIcon } from "@chakra-ui/icons";
import {Box, Button, Container, createIcon, Flex, Heading, HStack, Img, Menu, MenuButton, MenuItem, MenuList, Portal, useDisclosure,useToken, VStack} from '@chakra-ui/react';
import { useQueryClient } from "@tanstack/react-query";
import NextLink from "next/link";
import { useSelectedLayoutSegments } from "next/navigation";
import { useContext } from "react";

import { client } from "@/api.client";
import { CodeDepartementContext } from "@/app/codeDepartementContext";
import { CodeRegionContext } from "@/app/codeRegionContext";
import { CurrentCampagneContext } from "@/app/currentCampagneContext";
import { UaisContext } from "@/app/uaiContext";
import { useAuth } from "@/utils/security/useAuth";

import { InformationHeader } from "./InformationHeader";
import { Nav } from "./Nav";

const NON_STICKY_HEADER_SEGMENTS = [
  "console",
];

export const Header = ({ isMaintenance }: { isMaintenance?: boolean }) => {
  const { user, setAuth } = useAuth();
  const { setUais } = useContext(UaisContext);
  const { setCodeDepartement } = useContext(CodeDepartementContext);
  const { setCodeRegion } = useContext(CodeRegionContext);
  const { setCampagne } = useContext(CurrentCampagneContext);
  const queryClient = useQueryClient();
  const segments = useSelectedLayoutSegments();
  const shouldUseStickyHeader =
    segments.length === 0 || (
      segments.length !== 0 &&
      !segments.some((segment) => NON_STICKY_HEADER_SEGMENTS.includes(segment))
    );

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
    setCampagne(undefined);
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
              <Img height="80px" src="/logo_MENESR.png" alt="Ministère de l'Éducation Nationale, de l'Enseignement Supérieur et de la Recherche" />
            </Flex>
            <Heading as={"h1"} size={"md"}>
              <Box as="span" display={["none", null, "unset"]}>
                Outil d’aide à la transformation de la carte des formations
              </Box>
            </Heading>
          </HStack>
          <Box ml="auto">
            {!user && (
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
            {!!user && (
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
                  {user.email}
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
        <Box
          boxShadow="0 2px 3px rgba(0,0,18,0.16)"
          backgroundColor="white"
          position={shouldUseStickyHeader ? "sticky" : undefined}
          top={shouldUseStickyHeader ? 0 : undefined}
          zIndex={"docked"}
        >
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
