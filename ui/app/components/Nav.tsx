"use client";
import { HStack, Link } from "@chakra-ui/react";
import NextLink from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import { ReactNode } from "react";

const NavLink = ({
  children,
  segment,
  href,
}: {
  children: ReactNode;
  segment: string | null;
  href: string;
}) => {
  const activeSegment = useSelectedLayoutSegment();
  const isActive = activeSegment === segment;
  return (
    <Link
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
};

export const Nav = () => {
  return (
    <HStack spacing={4}>
      <NavLink href="/" segment={null}>
        Accueil
      </NavLink>
      <NavLink href="/console/formations" segment="console">
        Console
      </NavLink>
      <NavLink href="/panorama" segment="panorama">
        Panorama
      </NavLink>
    </HStack>
  );
};
