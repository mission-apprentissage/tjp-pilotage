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
  useDisclosure,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { useSelectedLayoutSegments } from "next/navigation";
import { usePlausible } from "next-plausible";
import { HTMLAttributeAnchorTarget, ReactNode, useContext } from "react";
import { hasPermission, hasRole, isUserInRegionsExperimentation } from "shared";

import { UaiFilterContext } from "@/app/layoutClient";
import { createParametrizedUrl } from "@/utils/createParametrizedUrl";
import { useAuth } from "@/utils/security/useAuth";

import { feature } from "../../../utils/feature";
import { Glossaire } from "../glossaire/Glossaire";

const NavLink = chakra(
  ({
    children,
    segment,
    href,
    className,
    target,
    plausibleEventName,
  }: {
    children: ReactNode;
    segment: string | null;
    href: string;
    className?: string;
    target?: HTMLAttributeAnchorTarget;
    plausibleEventName?: string;
  }) => {
    const trackEvent = usePlausible();
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
        onClick={() => {
          if (plausibleEventName !== undefined) {
            trackEvent(`nav:${plausibleEventName}`);
          }
        }}
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
    prefetch = true,
  }: {
    children: ReactNode;
    segment: string | null;
    href: string;
    className?: string;
    prefetch?: boolean;
  }) => {
    const segments = useSelectedLayoutSegments();
    const isActive =
      (!segment && !segments.length) ||
      (segment && segments.join("/").includes(segment));
    return (
      <Link
        className={className}
        variant={"unstyled"}
        as={prefetch ? NextLink : Link}
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
    isOpen,
    onMouseEnter,
    onMouseLeave,
  }: {
    children: ReactNode;
    className?: string;
    segment: string | null;
    isOpen?: boolean;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
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
        bg={isOpen ? "blueecume.950" : "unset"}
        height="100%"
        color="bluefrance.113"
        borderBottomWidth={3}
        borderColor={isActive ? "bluefrance.113" : "transparent"}
        _hover={{ textDecoration: "unset", bg: "blueecume.950" }}
        as={Button}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
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
  const hasIntentionsMenu =
    hasPermission(auth?.user.role, "intentions/lecture") ||
    hasPermission(auth?.user.role, "intentions-perdir/lecture") ||
    hasPermission(auth?.user.role, "pilotage-intentions/lecture") ||
    hasPermission(auth?.user.role, "restitution-intentions/lecture");

  const hasAdminMenu =
    hasPermission(auth?.user.role, "users/lecture") ||
    hasPermission(auth?.user.role, "campagnes/lecture");

  const shouldDisplayIntentionExpeMenu = isUserInRegionsExperimentation({
    user: auth?.user,
  });

  const shouldDisplayBothIntentionMenus =
    hasRole({
      user: auth?.user,
      role: "admin",
    }) || hasRole({ user: auth?.user, role: "pilote" });

  const hasOnlyFormulaireIntentionMenu =
    hasPermission(auth?.user.role, "intentions/lecture") &&
    !shouldDisplayIntentionExpeMenu &&
    !shouldDisplayBothIntentionMenus;

  const hasOnlyFormulaireIntentionExpeMenu =
    hasPermission(auth?.user.role, "intentions-perdir/lecture") &&
    shouldDisplayIntentionExpeMenu &&
    !shouldDisplayBothIntentionMenus;

  const {
    isOpen: isMenuPanoramaOpen,
    onOpen: onMenuPanoramaOpen,
    onClose: onMenuPanoramaClose,
  } = useDisclosure();

  const {
    isOpen: isMenuConsoleOpen,
    onOpen: onMenuConsoleOpen,
    onClose: onMenuConsoleClose,
  } = useDisclosure();

  const {
    isOpen: isMenuIntentionOpen,
    onOpen: onMenuIntentionOpen,
    onClose: onMenuIntentionClose,
  } = useDisclosure();

  const {
    isOpen: isMenuAdminOpen,
    onOpen: onMenuAdminOpen,
    onClose: onMenuAdminClose,
  } = useDisclosure();

  return (
    <Flex direction={"row"} align="center" flexWrap="wrap" width={"100%"}>
      <NavLink mr="4" href="/" segment={null}>
        Accueil
      </NavLink>
      <Menu gutter={0} matchWidth={true} isOpen={isMenuPanoramaOpen}>
        <NavMenuButton
          segment="panorama"
          isOpen={isMenuPanoramaOpen}
          onMouseEnter={onMenuPanoramaOpen}
          onMouseLeave={onMenuPanoramaClose}
        >
          Panorama
        </NavMenuButton>
        <MenuList
          p="0"
          borderTop="unset"
          onMouseEnter={onMenuPanoramaOpen}
          onMouseLeave={onMenuPanoramaClose}
        >
          <MenuItem p="0">
            <NavMenuLink href="/panorama/region" segment="panorama/region">
              Région
            </NavMenuLink>
          </MenuItem>
          <MenuItem p="0">
            <NavMenuLink
              href="/panorama/departement"
              segment="panorama/departement"
            >
              Département
            </NavMenuLink>
          </MenuItem>
          <MenuItem p="0">
            <NavMenuLink
              href="/panorama/etablissement"
              segment="panorama/etablissement"
            >
              Établissement
            </NavMenuLink>
          </MenuItem>
          {feature.panoramaFormation && (
            <MenuItem p="0">
              <NavMenuLink
                href="/panorama/domaine-de-formation"
                segment="panorama/domaine-de-formation"
              >
                Domaine de formation
              </NavMenuLink>
            </MenuItem>
          )}
          <MenuItem p="0">
            <NavMenuLink
              href="/panorama/lien-metier-formation"
              segment="panorama/lien-metier-formation"
            >
              Lien métier formation
            </NavMenuLink>
          </MenuItem>
        </MenuList>
      </Menu>
      <Menu gutter={0} matchWidth={true} isOpen={isMenuConsoleOpen}>
        <NavMenuButton
          segment="console"
          isOpen={isMenuConsoleOpen}
          onMouseEnter={onMenuConsoleOpen}
          onMouseLeave={onMenuConsoleClose}
        >
          Console
        </NavMenuButton>
        <MenuList
          p="0"
          borderTop="unset"
          onMouseEnter={onMenuConsoleOpen}
          onMouseLeave={onMenuConsoleClose}
        >
          <MenuItem p="0">
            <NavMenuLink
              href="/console/formations"
              segment="/console/formations"
            >
              Formation
            </NavMenuLink>
          </MenuItem>
          <MenuItem p="0">
            <NavMenuLink
              href={
                uaiFilter
                  ? createParametrizedUrl("/console/etablissements", {
                      filters: {
                        uai: [uaiFilter],
                      },
                    })
                  : "/console/etablissements"
              }
              segment="consoles/etablissements"
            >
              Établissement
            </NavMenuLink>
          </MenuItem>
        </MenuList>
      </Menu>
      {hasIntentionsMenu && (
        <Menu gutter={0} isOpen={isMenuIntentionOpen}>
          <NavMenuButton
            segment="intentions"
            isOpen={isMenuIntentionOpen}
            onMouseEnter={onMenuIntentionOpen}
            onMouseLeave={onMenuIntentionClose}
          >
            Transformation
          </NavMenuButton>
          <MenuList
            p="0"
            borderTop="unset"
            w="100%"
            onMouseEnter={onMenuIntentionOpen}
            onMouseLeave={onMenuIntentionClose}
          >
            {shouldDisplayBothIntentionMenus ? (
              <>
                <MenuItem p="0" w="100%">
                  <NavMenuLink
                    href="/intentions/saisie"
                    segment="saisie-intentions"
                  >
                    Gestion des demandes
                  </NavMenuLink>
                </MenuItem>
                <MenuItem p="0" w="100%">
                  <NavMenuLink
                    href="/intentions/perdir/saisie"
                    segment="saisie-intentions-perdir"
                  >
                    Gestion des demandes (EXPE)
                  </NavMenuLink>
                </MenuItem>
              </>
            ) : (
              <>
                {hasOnlyFormulaireIntentionMenu && (
                  <MenuItem p="0" w="100%">
                    <NavMenuLink
                      href="/intentions/saisie"
                      segment="saisie-intentions"
                    >
                      Gestion des demandes
                    </NavMenuLink>
                  </MenuItem>
                )}
                {hasOnlyFormulaireIntentionExpeMenu && (
                  <MenuItem p="0" w="100%">
                    <NavMenuLink
                      href="/intentions/perdir/saisie"
                      segment="saisie-intentions-perdir"
                    >
                      Gestion des demandes
                    </NavMenuLink>
                  </MenuItem>
                )}
              </>
            )}
            {hasPermission(auth?.user.role, "pilotage-intentions/lecture") && (
              <MenuItem p="0">
                <NavMenuLink
                  href="/intentions/pilotage"
                  segment="pilotage-intentions"
                  prefetch={false}
                >
                  Pilotage
                </NavMenuLink>
              </MenuItem>
            )}
            {(hasPermission(auth?.user.role, "intentions/lecture") ||
              hasPermission(auth?.user.role, "intentions-perdir/lecture")) && (
              <MenuItem p="0" w="100%">
                <NavMenuLink
                  href="/intentions/restitution"
                  segment="restitution-intentions"
                  prefetch={false}
                >
                  Restitution des demandes
                </NavMenuLink>
              </MenuItem>
            )}
            {feature.correction &&
              hasPermission(auth?.user.role, "intentions/lecture") && (
                <MenuItem p="0" w="100%">
                  <NavMenuLink
                    href="/intentions/corrections"
                    segment="corrections"
                    prefetch={false}
                  >
                    Restitution des corrections
                  </NavMenuLink>
                </MenuItem>
              )}
          </MenuList>
        </Menu>
      )}
      {hasPermission(auth?.user.role, "pilotage_reforme/lecture") && (
        <NavLink href="/pilotage-reforme" segment="pilotage-reforme">
          Suivi de l'impact
        </NavLink>
      )}

      {hasAdminMenu && (
        <Menu gutter={0} matchWidth={true} isOpen={isMenuAdminOpen}>
          <NavMenuButton
            segment="admin"
            isOpen={isMenuAdminOpen}
            onMouseEnter={onMenuAdminOpen}
            onMouseLeave={onMenuAdminClose}
          >
            Admin
          </NavMenuButton>
          <MenuList
            p="0"
            borderTop="unset"
            w="100%"
            onMouseEnter={onMenuAdminOpen}
            onMouseLeave={onMenuAdminClose}
          >
            {hasPermission(auth?.user.role, "users/lecture") && (
              <MenuItem p="0">
                <NavMenuLink href="/admin/users" segment="admin/users">
                  Utilisateurs
                </NavMenuLink>
              </MenuItem>
            )}
            {hasPermission(auth?.user.role, "campagnes/lecture") && (
              <MenuItem p="0">
                <NavMenuLink href="/admin/campagnes" segment="admin/campagnes">
                  Campagnes
                </NavMenuLink>
              </MenuItem>
            )}
            {hasPermission(auth?.user.role, "users/lecture") && (
              <MenuItem p="0">
                <NavMenuLink href="/admin/roles" segment="admin/roles">
                  Rôles
                </NavMenuLink>
              </MenuItem>
            )}
          </MenuList>
        </Menu>
      )}
      <Glossaire />
    </Flex>
  );
};
