"use client";
import { chakra, Flex, Link } from "@chakra-ui/react";
import NextLink from "next/link";
import { useSelectedLayoutSegments } from "next/navigation";
import { ReactNode } from "react";
import { hasPermission } from "shared";

import { useAuth } from "@/utils/security/useAuth";

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

export const Nav = () => {
  const { auth } = useAuth();

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
      {hasPermission(auth?.user.role, "intentions/lecture") && (
        <NavLink mr="4" href="/intentions" segment="intentions">
          Recueil des demandes
        </NavLink>
      )}
      {hasPermission(auth?.user.role, "intentions/lecture") && (
        <NavLink
          mr="4"
          href="/restitution-demandes"
          segment="restitution-demandes"
        >
          Restitution des demandes
        </NavLink>
      )}
      {hasPermission(auth?.user.role, "pilotage_reforme/lecture") && (
        <NavLink href="/pilotage-reforme" segment="pilotage-reforme">
          Pilotage de la réforme
        </NavLink>
      )}
    </Flex>
  );
};
