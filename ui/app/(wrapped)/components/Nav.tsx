"use client";
import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Button,
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
import { HTMLAttributeAnchorTarget, ReactNode, useContext } from "react";
import { hasPermission } from "shared";

import { UaiFilterContext } from "@/app/layoutClient";
import { createParametrizedUrl } from "@/utils/createParametrizedUrl";
import { useAuth } from "@/utils/security/useAuth";

import { Glossaire } from "../glossaire/Glossaire";

const NavLink = chakra(
  ({
    children,
    segment,
    href,
    className,
    target,
  }: {
    children: ReactNode;
    segment: string | null;
    href: string;
    className?: string;
    target?: HTMLAttributeAnchorTarget;
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
        px={[2, null, 4]}
        py={[2, null, 4]}
        color="bluefrance.113"
        borderBottomWidth={3}
        borderColor={isActive ? "bluefrance.113" : "transparent"}
        _hover={{ textDecoration: "unset", bg: "blueecume.925" }}
        target={target ?? "_self"}
      >
        {children}
      </Link>
    );
  }
);

const NavMenuLink = chakra(
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
        w="100%"
        h="100%"
        m="0"
        color="bluefrance.113"
        bg={isActive ? "grey.1000_hover" : "inherit"}
        _hover={{ textDecoration: "unset", bg: "blueecume.950" }}
      >
        {children}
      </Link>
    );
  }
);

const NavMenuButton = chakra(
  ({
    children,
    className,
    segment,
  }: {
    children: ReactNode;
    className?: string;
    segment: string | null;
  }) => {
    const segments = useSelectedLayoutSegments();
    const isActive =
      (!segment && !segments.length) ||
      (segment && segments.join("/").includes(segment));
    return (
      <MenuButton
        className={className}
        variant={"unstyled"}
        fontSize={14}
        fontWeight="normal"
        px={[2, null, 4]}
        py={[2, null, 4]}
        borderRadius="unset"
        bg="unset"
        height="100%"
        color="bluefrance.113"
        borderBottomWidth={3}
        borderColor={isActive ? "bluefrance.113" : "transparent"}
        _hover={{ textDecoration: "unset", bg: "blueecume.950" }}
        as={Button}
        rightIcon={<ChevronDownIcon />}
      >
        {children}
      </MenuButton>
    );
  }
);

export const Nav = () => {
  const { auth } = useAuth();
  const { uaiFilter } = useContext(UaiFilterContext);

  return (
    <Flex direction={"row"} align="center" flexWrap="wrap" width={"100%"}>
      <NavLink mr="4" href="/" segment={null}>
        Accueil
      </NavLink>
      <NavLink mr="4" href="/panorama" segment="panorama">
        Panorama
      </NavLink>
      <NavLink
        mr="4"
        href={
          uaiFilter
            ? createParametrizedUrl("/console/etablissements", {
                filters: {
                  uai: [uaiFilter],
                },
              })
            : "/console/formations"
        }
        segment="console"
      >
        Console
      </NavLink>
      {hasPermission(auth?.user.role, "intentions/lecture") && (
        <Menu gutter={0} matchWidth={true}>
          <NavMenuButton segment="intentions">
            Recueil des demandes
          </NavMenuButton>
          <MenuList p="0" borderTop="unset" w="100%">
            <MenuItem p="0" w="100%">
              <NavMenuLink
                href="/intentions/saisie"
                segment="saisie-intentions"
              >
                Formulaire
              </NavMenuLink>
            </MenuItem>
            {hasPermission(auth?.user.role, "pilotage-intentions/lecture") && (
              <MenuItem p="0">
                <NavMenuLink
                  href="/intentions/pilotage"
                  segment="pilotage-intentions"
                >
                  Pilotage
                </NavMenuLink>
              </MenuItem>
            )}
            {hasPermission(
              auth?.user.role,
              "restitution-intentions/lecture"
            ) && (
              <MenuItem p="0">
                <NavMenuLink
                  href="/intentions/restitution"
                  segment="restitution-intentions"
                >
                  Restitution
                </NavMenuLink>
              </MenuItem>
            )}
          </MenuList>
        </Menu>
      )}
      {hasPermission(auth?.user.role, "pilotage_reforme/lecture") && (
        <NavLink href="/pilotage-reforme" segment="pilotage-reforme">
          Pilotage de la réforme
        </NavLink>
      )}
      {hasPermission(auth?.user.role, "users/lecture") && (
        <NavLink href="/admin/users" segment="admin/users">
          Utilisateurs
        </NavLink>
      )}
      <NavLink
        href="https://sunrise-waitress-5d6.notion.site/a09d6b68b9bd4c5ea8460e2b41939f41?v=5d5afb3f224f44499f9d96628eb5d510&pvs=4"
        target="_blank"
        segment="ressources"
      >
        Ressources
      </NavLink>
      <Glossaire />
    </Flex>
  );
};
