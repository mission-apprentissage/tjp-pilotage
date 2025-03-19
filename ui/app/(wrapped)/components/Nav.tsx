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
  Portal,
  useDisclosure,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { useSelectedLayoutSegments } from "next/navigation";
import { usePlausible } from "next-plausible";
import type { HTMLAttributeAnchorTarget, ReactNode } from "react";
import { useContext } from "react";
import {hasPermission, hasRole, RoleEnum} from 'shared';
import {PermissionEnum} from 'shared/enum/permissionEnum';
import type { CampagneType } from "shared/schema/campagneSchema";
import type { UserType } from "shared/schema/userSchema";

import { Glossaire } from "@/app/(wrapped)/glossaire/Glossaire";
import { UaisContext } from "@/app/uaiContext";
import { createParameterizedUrl } from "@/utils/createParameterizedUrl";
import { feature } from "@/utils/feature";
import { getRoutingSaisieRecueilDemande } from "@/utils/getRoutingRecueilDemande";
import { isPerdirPartOfExpe } from "@/utils/isPartOfExpe";
import { useAuth } from "@/utils/security/useAuth";
import { useCurrentCampagne } from "@/utils/security/useCurrentCampagne";

const shouldDisplayIntentionsMenu = ({ user, campagne }: {user?: UserType, campagne?: CampagneType}) => {
  if(!campagne || !user) return false;

  if(
    !hasPermission(user.role, PermissionEnum["intentions/lecture"]) &&
    !hasPermission(user.role, PermissionEnum["intentions-perdir/lecture"]) &&
    !hasPermission(user.role, PermissionEnum["pilotage-intentions/lecture"]) &&
    !hasPermission(user.role, PermissionEnum["restitution-intentions/lecture"])
  ) return false;

  if(hasRole({user, role: RoleEnum["perdir"]})) return isPerdirPartOfExpe({user, campagne});

  return true;
};

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
    const isActive = (!segment && !segments.length) || (segment && segments.join("/").includes(segment));
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

const NavMenuItem = chakra(
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
    const isActive = (!segment && !segments.length) || (segment && segments.join("/").includes(segment));
    return (
      <MenuItem
        className={className}
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
        _focus={{ bg: "blueecume.950", borderColor: "bluefrance.113", borderWidth: 0, borderBottomWidth: 2, boxShadow: "none" }}
      >
        {children}
      </MenuItem>
    );
  }
);

const NavMenuButton = chakra(
  ({
    children,
    className,
    segment,
    isOpen,
    onOpen,
    onClose,
  }: {
    children: ReactNode;
    className?: string;
    segment: string | null;
    isOpen?: boolean;
    onOpen: () => void;
    onClose: () => void;
  }) => {
    const segments = useSelectedLayoutSegments();
    const isActive = (!segment && !segments.length) || (segment && segments.join("/").includes(segment));
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
        tabIndex={0}
        onMouseEnter={onOpen}
        onMouseLeave={onClose}
        // onFocus={onOpen}
        // onClick={onOpen}
        // onBlur={onClose}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            onClose();
          }
          if (e.key === "Enter") {
            onOpen();
          }
        }}
        rightIcon={<ChevronDownIcon />}
      >
        {children}
      </MenuButton>
    );
  }
);

export const Nav = () => {
  const { user, role } = useAuth();
  const { campagne } = useCurrentCampagne();
  const { uais } = useContext(UaisContext);

  const hasAdminMenu =
    hasPermission(role, PermissionEnum["users/lecture"]) || hasPermission(role, PermissionEnum["campagnes/lecture"]);

  const { isOpen: isMenuPanoramaOpen, onOpen: onMenuPanoramaOpen, onClose: onMenuPanoramaClose } = useDisclosure();

  const { isOpen: isMenuConsoleOpen, onOpen: onMenuConsoleOpen, onClose: onMenuConsoleClose } = useDisclosure();

  const { isOpen: isMenuIntentionOpen, onOpen: onMenuIntentionOpen, onClose: onMenuIntentionClose } = useDisclosure();

  const { isOpen: isMenuAdminOpen, onOpen: onMenuAdminOpen, onClose: onMenuAdminClose } = useDisclosure();

  return (
    <Flex direction={"row"} align="center" flexWrap="wrap" width={"100%"}>
      <NavLink mr="4" href="/" segment={null}>
        Accueil
      </NavLink>
      <Menu gutter={0} matchWidth={true} isOpen={isMenuPanoramaOpen}>
        <NavMenuButton
          segment="panorama"
          isOpen={isMenuPanoramaOpen}
          onOpen={onMenuPanoramaOpen}
          onClose={onMenuPanoramaClose}
        >
          Panorama
        </NavMenuButton>
        <Portal>
          <MenuList
            p="0"
            borderTop="unset"
            onMouseEnter={onMenuPanoramaOpen}
            onMouseLeave={onMenuPanoramaClose}
            zIndex={"dropdown"}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                onMenuPanoramaClose();
              }
            }}
          >
            <NavMenuItem href="/panorama/region" segment="panorama/region">
              Région
            </NavMenuItem>
            <NavMenuItem href="/panorama/departement" segment="panorama/departement">
              Département
            </NavMenuItem>
            <NavMenuItem href="/panorama/etablissement" segment="panorama/etablissement">
              Établissement
            </NavMenuItem>
            <NavMenuItem href="/panorama/lien-metier-formation" segment="panorama/lien-metier-formation">
              Lien métier formation
            </NavMenuItem>
            <NavMenuItem href="/panorama/domaine-de-formation" segment="panorama/domaine-de-formation">
              Domaine de formation
            </NavMenuItem>
          </MenuList>
        </Portal>
      </Menu>
      <Menu gutter={0} matchWidth={true} isOpen={isMenuConsoleOpen}>
        <NavMenuButton
          segment="console"
          isOpen={isMenuConsoleOpen}
          onOpen={onMenuConsoleOpen}
          onClose={onMenuConsoleClose}
        >
          Console
        </NavMenuButton>
        <Portal>
          <MenuList
            p="0"
            borderTop="unset"
            onMouseEnter={onMenuConsoleOpen}
            onMouseLeave={onMenuConsoleClose}
            zIndex={"dropdown"}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                onMenuConsoleClose();
              }
            }}
          >
            <NavMenuItem href="/console/formations" segment="/console/formations">
              Formation
            </NavMenuItem>
            <NavMenuItem
              href={
                uais
                  ? createParameterizedUrl("/console/etablissements", {
                    filters: {
                      uai: uais,
                    },
                  })
                  : "/console/etablissements"
              }
              segment="consoles/etablissements"
            >
                Établissement
            </NavMenuItem>
          </MenuList>
        </Portal>
      </Menu>
      {shouldDisplayIntentionsMenu({ user, campagne }) && (
        <Menu gutter={0} isOpen={isMenuIntentionOpen}>
          <NavMenuButton
            segment="intentions"
            isOpen={isMenuIntentionOpen}
            onOpen={onMenuIntentionOpen}
            onClose={onMenuIntentionClose}
          >
            Transformation
          </NavMenuButton>
          <Portal>
            <MenuList
              p="0"
              border="unset"
              w="100%"
              onMouseEnter={onMenuIntentionOpen}
              onMouseLeave={onMenuIntentionClose}
              zIndex={"dropdown"}
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  onMenuIntentionClose();
                }
              }}
            >
              <NavMenuItem href={getRoutingSaisieRecueilDemande({campagne, user})} segment="saisie" prefetch={false}>
                Gestion des demandes
              </NavMenuItem>
              {hasPermission(role, PermissionEnum["pilotage-intentions/lecture"]) && (
                <NavMenuItem href="/intentions/pilotage" segment="pilotage-intentions" prefetch={false}>
                  Pilotage
                </NavMenuItem>
              )}
              {(hasPermission(role, PermissionEnum["restitution-intentions/lecture"])) && (
                <NavMenuItem href="/intentions/restitution" segment="restitution-intentions" prefetch={false}>
                  Restitution des demandes
                </NavMenuItem>
              )}
              {feature.correction && hasPermission(role, PermissionEnum["intentions/lecture"]) && (
                <NavMenuItem href="/intentions/corrections" segment="corrections" prefetch={false}>
                  Restitution des corrections
                </NavMenuItem>
              )}
            </MenuList>
          </Portal>
        </Menu>
      )}
      {hasPermission(role, PermissionEnum["suivi-impact/lecture"]) && (
        <NavLink href="/suivi-impact" segment="suivi-impact">
          Suivi de l'impact
        </NavLink>
      )}

      {hasAdminMenu && (
        <Menu gutter={0} matchWidth={true} isOpen={isMenuAdminOpen}>
          <NavMenuButton
            segment="admin"
            isOpen={isMenuAdminOpen}
            onOpen={onMenuAdminOpen}
            onClose={onMenuAdminClose}
          >
            Admin
          </NavMenuButton>
          <Portal>
            <MenuList
              p="0"
              borderTop="unset"
              w="100%"
              onMouseEnter={onMenuAdminOpen}
              onMouseLeave={onMenuAdminClose}
              zIndex={"dropdown"}
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  onMenuAdminClose();
                }
              }}
            >
              {hasPermission(role, PermissionEnum["users/lecture"]) && (
                <NavMenuItem href="/admin/users" segment="admin/users">
                  Utilisateurs
                </NavMenuItem>
              )}
              {(hasPermission(role, PermissionEnum["campagnes/lecture"]) ||
               hasPermission(role, PermissionEnum["campagnes-région/lecture"])) && (
                <NavMenuItem href="/admin/campagnes" segment="admin/campagnes">
                  Campagnes
                </NavMenuItem>
              )}
              {hasPermission(role, PermissionEnum["users/lecture"]) && (
                <NavMenuItem href="/admin/roles" segment="admin/roles">
                  Rôles
                </NavMenuItem>
              )}
            </MenuList>
          </Portal>
        </Menu>
      )}
      <Glossaire />
    </Flex>
  );
};
