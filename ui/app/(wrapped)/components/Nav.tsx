"use client";
import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Box,
  chakra,
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

import { AuthContext } from "@/app/(wrapped)/auth/authContext";

import { api } from "../../../api.client";

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
      const segments = useSelectedLayoutSegments();

      return (
        <Box
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
      <NavLink mr="4" href="/panorama" segment="panorama">
        Panorama
      </NavLink>
      <NavLink mr="4" href="/console/formations" segment="console">
        Console
      </NavLink>
      {!auth && (
        <NavLink ml="auto" href="/auth/login" segment="auth/login">
          Se connecter
        </NavLink>
      )}
      {!!auth && (
        <Menu autoSelect={false} placement="bottom-end">
          <MenuButton
            ml="auto"
            as={NavButton}
            variant="ghost"
            rightIcon={<ChevronDownIcon />}
          >
            Bienvenue, {auth.user.email}
          </MenuButton>
          <MenuList>
            <MenuItem onClick={logout}>Se déconnecter</MenuItem>
          </MenuList>
        </Menu>
      )}
    </Flex>
  );
};
