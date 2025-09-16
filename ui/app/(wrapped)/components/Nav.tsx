"use client";
import { ChevronDownIcon, QuestionOutlineIcon } from "@chakra-ui/icons";
import { Box, Button, chakra, Flex, Link, Menu, MenuButton, MenuItem, MenuList, Portal, Tooltip,useDisclosure } from "@chakra-ui/react";
import {Icon} from '@iconify/react';
import NextLink from "next/link";
import { useSelectedLayoutSegments } from "next/navigation";
import { usePlausible } from "next-plausible";
import type { HTMLAttributeAnchorTarget, ReactNode } from "react";
import { useContext } from "react";
import {hasPermission, hasRole, RoleEnum} from 'shared';
import {PermissionEnum} from 'shared/enum/permissionEnum';
import type { CampagneType } from "shared/schema/campagneSchema";
import type { UserType } from "shared/schema/userSchema";

import { getMessageAccompagnementCampagne } from "@/app/(wrapped)/demandes/utils/messageAccompagnementUtils";
import { Glossaire } from "@/app/(wrapped)/glossaire/Glossaire";
import { UaisContext } from "@/app/uaiContext";
import { createParameterizedUrl } from "@/utils/createParameterizedUrl";
import { feature } from "@/utils/feature";
import { getRoutingAccessSaisieDemande } from "@/utils/getRoutingAccesDemande";
import { isPerdirPartOfSaisieDemande } from "@/utils/isPartOfSaisieDemande";
import { canCreateDemande } from "@/utils/permissionsDemandeUtils";
import { useAuth } from "@/utils/security/useAuth";
import { useCurrentCampagne } from "@/utils/security/useCurrentCampagne";

const DOCUMENTATION_LINKS = {
  // Panorama
  ["panorama/region"]: "/documentation/co/000_-_Panorama_Region_-_Departement.html",
  ["panorama/departement"]: "/documentation/co/000_-_Panorama_Region_-_Departement.html",
  ["panorama/etablissement"]: "/documentation/co/000_-_Panorama_Etablissement.html",
  ["panorama/domaine-de-formation"]: "/documentation/co/000_-_Panorama_Domaine_de_formation.html",
  ["panorama/lien-metier-formation/metier"]: "/documentation/co/000_-_Panorama_Lien_Metier_Formation.html",
  ["panorama/lien-metier-formation/formation"]: "/documentation/co/000_-_Panorama_Lien_Metier_Formation.html",
  // Console
  ["console/formations"]: "/documentation/co/000_-_Consoles.html",
  ["console/etablissements"]: "/documentation/co/000_-_Consoles.html",
  // Demandes
  ["demandes/saisie"]: "/documentation/co/000_-_Gestion_des_demandes.html",
  ["demandes/saisie/"]: "/documentation/co/001_-_Saisie_dans_le_formulaire.html",
  ["demandes/restitution"]: "/documentation/co/002_-_Restitution_des_demandes.html",
  ["demandes/corrections"]: "/documentation/co/006_-_Restitution_des_corrections.html",
  ["demandes/pilotage"]: "/documentation/co/002_-_Comprendre_et_utiliser_les_projections_de_transformation.html",
  // Suivi de l'impact
  ["suivi-impact"]: "/documentation/co/007_-_Suivi_de_l3impact.html",
  // Admin
  ["admin/users"]: "/documentation/co/000_-_Gestion_des_utilisateurs_dans_Orion.html",
  ["admin/roles"]: "/documentation/co/000_-_Comprendre_les_roles__permissions_et_responsabilites_dans_Orion_.html",
  ["admin/campagnes/national"]: "/documentation/co/001_-_Gestion_des_campagnes_et_temporalite.html",
  ["admin/campagnes/regional"]: "/documentation/co/001_-_Gestion_des_campagnes_et_temporalite.html",
};

const getDocumentationLink = (segment?: string) => {
  if(segment === "") return "/documentation";
  if(segment?.startsWith("demandes/saisie/")) return DOCUMENTATION_LINKS["demandes/saisie/"] ?? "/documentation";
  return DOCUMENTATION_LINKS[segment as keyof typeof DOCUMENTATION_LINKS] ?? "/documentation";
};

const shouldDisplayDemandesMenu = ({ user, campagne }: {user?: UserType, campagne?: CampagneType}) => {
  if(!campagne || !user) return false;

  if(
    !hasPermission(user.role, PermissionEnum["demande/lecture"]) &&
    !hasPermission(user.role, PermissionEnum["pilotage/lecture"]) &&
    !hasPermission(user.role, PermissionEnum["restitution/lecture"])
  ) return false;

  if(hasRole({user, role: RoleEnum["perdir"]})) return isPerdirPartOfSaisieDemande({user, campagne});

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
    const isActive = (!segment && !segments.length) || (segment && segments.join("/").includes(segment));
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
  const { user, role } = useAuth();
  const { campagne } = useCurrentCampagne();
  const { uais } = useContext(UaisContext);
  const segment = useSelectedLayoutSegments().join("/");


  const hasAdminMenu =
    hasPermission(role, PermissionEnum["users/lecture"]) || hasPermission(role, PermissionEnum["campagnes/lecture"]);

  const { isOpen: isMenuPanoramaOpen, onOpen: onMenuPanoramaOpen, onClose: onMenuPanoramaClose } = useDisclosure();

  const { isOpen: isMenuConsoleOpen, onOpen: onMenuConsoleOpen, onClose: onMenuConsoleClose } = useDisclosure();

  const { isOpen: isMenuDemandeOpen, onOpen: onMenuDemandeOpen, onClose: onMenuDemandeClose } = useDisclosure();

  const { isOpen: isMenuAdminOpen, onOpen: onMenuAdminOpen, onClose: onMenuAdminClose } = useDisclosure();

  return (
    <Flex direction={"row"} align="center" flexWrap="wrap" width={"100%"} zIndex="100">
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
        <Portal>
          <MenuList
            p="0"
            borderTop="unset"
            onMouseEnter={onMenuPanoramaOpen}
            onMouseLeave={onMenuPanoramaClose}
            zIndex={"dropdown"}
          >
            <MenuItem p="0">
              <NavMenuLink href="/panorama/region" segment="panorama/region">
                Région
              </NavMenuLink>
            </MenuItem>
            <MenuItem p="0">
              <NavMenuLink href="/panorama/departement" segment="panorama/departement">
                Département
              </NavMenuLink>
            </MenuItem>
            <MenuItem p="0">
              <NavMenuLink href="/panorama/etablissement" segment="panorama/etablissement">
                Établissement
              </NavMenuLink>
            </MenuItem>
            <MenuItem p="0">
              <NavMenuLink href="/panorama/lien-metier-formation" segment="panorama/lien-metier-formation">
                Lien métier formation
              </NavMenuLink>
            </MenuItem>
            <MenuItem p="0">
              <NavMenuLink href="/panorama/domaine-de-formation" segment="panorama/domaine-de-formation">
                Domaine de formation
              </NavMenuLink>
            </MenuItem>
          </MenuList>
        </Portal>
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
        <Portal>
          <MenuList
            p="0"
            borderTop="unset"
            onMouseEnter={onMenuConsoleOpen}
            onMouseLeave={onMenuConsoleClose}
            zIndex={"dropdown"}
          >
            <MenuItem p="0">
              <NavMenuLink href="/console/formations" segment="/console/formations">
                Formation
              </NavMenuLink>
            </MenuItem>
            <MenuItem p="0">
              <NavMenuLink
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
              </NavMenuLink>
            </MenuItem>
          </MenuList>
        </Portal>
      </Menu>
      {shouldDisplayDemandesMenu({ user, campagne }) && (
        <Menu gutter={0} isOpen={isMenuDemandeOpen}>
          <NavMenuButton
            segment="demandes"
            isOpen={isMenuDemandeOpen}
            onMouseEnter={onMenuDemandeOpen}
            onMouseLeave={onMenuDemandeClose}
          >
            Transformation
          </NavMenuButton>
          <Portal>
            <MenuList
              p="0"
              borderTop="unset"
              w="100%"
              onMouseEnter={onMenuDemandeOpen}
              onMouseLeave={onMenuDemandeClose}
              zIndex={"dropdown"}
            >
              <MenuItem p="0" w="100%">
                <NavMenuLink href={getRoutingAccessSaisieDemande({user, campagne})} segment="saisie">
                    Gestion des demandes
                </NavMenuLink>
              </MenuItem>
              {hasPermission(role, PermissionEnum["pilotage/lecture"]) && (
                <MenuItem p="0">
                  <NavMenuLink href="/demandes/pilotage" segment="pilotage" prefetch={false}>
                    Pilotage
                  </NavMenuLink>
                </MenuItem>
              )}
              {(hasPermission(role, PermissionEnum["restitution/lecture"])) && (
                <MenuItem p="0" w="100%">
                  <NavMenuLink href="/demandes/restitution" segment="restitution" prefetch={false}>
                    Restitution des demandes
                  </NavMenuLink>
                </MenuItem>
              )}
              {feature.correction && hasPermission(role, PermissionEnum["demande/lecture"]) && (
                <MenuItem p="0" w="100%">
                  <NavMenuLink href="/demandes/corrections" segment="corrections" prefetch={false}>
                    Restitution des corrections
                  </NavMenuLink>
                </MenuItem>
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
            onMouseEnter={onMenuAdminOpen}
            onMouseLeave={onMenuAdminClose}
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
            >
              {hasPermission(role, PermissionEnum["users/lecture"]) && (
                <MenuItem p="0">
                  <NavMenuLink href="/admin/users" segment="admin/users">
                    Utilisateurs
                  </NavMenuLink>
                </MenuItem>
              )}
              {(hasPermission(role, PermissionEnum["campagnes/lecture"]) ||
               hasPermission(role, PermissionEnum["campagnes-région/lecture"])) && (
                <MenuItem p="0">
                  <NavMenuLink href="/admin/campagnes" segment="admin/campagnes">
                    Campagnes
                  </NavMenuLink>
                </MenuItem>
              )}
              {hasPermission(role, PermissionEnum["users/lecture"]) && (
                <MenuItem p="0">
                  <NavMenuLink href="/admin/roles" segment="admin/roles">
                    Rôles
                  </NavMenuLink>
                </MenuItem>
              )}
            </MenuList>
          </Portal>
        </Menu>
      )}
      {
        (
          hasRole({ user, role: RoleEnum["perdir"] }) &&
          campagne &&
          canCreateDemande({ user, campagne: campagne!})
        ) && (
          <Box display={"flex"} flexGrow={"1"} justifyContent={"end"} zIndex={"tooltip"} me={2}>

            <Tooltip
              label={getMessageAccompagnementCampagne({ campagne: campagne!, currentCampagne: campagne!, user })}
              shouldWrapChildren
              placement="bottom-start"
            >
              <Button
                as={NextLink}
                href={getRoutingAccessSaisieDemande({user, campagne, suffix: `new?campagneId=${campagne?.id}`})}
                isDisabled={!canCreateDemande({ user, campagne: campagne! })}
                variant={"primary"}
                fontSize={14}
                color={"white"}
                leftIcon={<Icon icon="ri:file-add-line" height={"20px"} />}
              >
                Nouvelle demande
              </Button>
            </Tooltip>
          </Box>
        )
      }
      <Button
        as={NextLink}
        href={getDocumentationLink(segment)}
        variant={"secondary"}
        leftIcon={<QuestionOutlineIcon height={"14px"} width={"14px"} />}
        color="bluefrance.113"
        fontSize={14}
        ms={"auto"}
        me={2}
      >
        Aide en ligne
      </Button>
      <Glossaire />
    </Flex>
  );
};
