"use client";
import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Box,
  chakra,
  createIcon,
  Flex,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { useSelectedLayoutSegments } from "next/navigation";
import { forwardRef, ReactNode, useContext } from "react";
import { hasPermission } from "shared";

import { AuthContext } from "@/app/(wrapped)/auth/authContext";

import { api } from "../../../api.client";

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

const NavLink = chakra(
  ({
    children,
    segment,
    href,
    className,
  }: {
    children: ReactNode;
    segment: string | null;
    href: string;
    className?: string;
  }) => {
    const segments = useSelectedLayoutSegments();
    const isActive =
      (!segment && !segments.length) ||
      (segment && segments.join("/").includes(segment));
    return (
      <Link
        className={className}
        variant={"unstyled"}
        as={NextLink}
        href={href}
        fontSize={14}
        p={4}
        color="bluefrance.113"
        borderBottomWidth={3}
        borderColor={isActive ? "bluefrance.113" : "transparent"}
        _hover={{ textDecoration: "unset", bg: "grey.1000_hover" }}
      >
        {children}
      </Link>
    );
  }
);

const NavButton = chakra(
  forwardRef(
    (
      {
        children,
        className,
        ...rest
      }: {
        children: ReactNode;
        className?: string;
      },
      ref
    ) => {
      return (
        <Box
          //@ts-ignore
          ref={ref}
          {...rest}
          position="relative"
          as="button"
          className={className}
          fontSize={14}
          p={4}
          color="bluefrance.113"
          _hover={{ bg: "grey.1000_hover" }}
        >
          {children}
        </Box>
      );
    }
  )
);

export const Nav = () => {
  const { auth, setAuth } = useContext(AuthContext);

  const logout = async () => {
    await api.logout({}).call();
    setAuth(undefined);
  };

  return (
    <Flex align="center">
      <NavLink mr="4" href="/" segment={null}>
        Accueil
      </NavLink>
      {hasPermission(auth?.user.role, "panorama/region") && (
        <NavLink mr="4" href="/panorama" segment="panorama">
          Panorama
        </NavLink>
      )}
      <NavLink mr="4" href="/console/formations" segment="console">
        Console
      </NavLink>
      {!auth && (
        <NavLink ml="auto" href="/auth/login" segment="auth/login">
          <LoginIcon mr="1" /> Se connecter
        </NavLink>
      )}
      {!!auth && (
        <Menu autoSelect={false} placement="bottom-end">
          <MenuButton ml="auto" as={NavButton}>
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
    </Flex>
  );
};
