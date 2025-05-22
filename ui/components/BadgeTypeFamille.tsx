import type { BadgeProps } from "@chakra-ui/react";
import {Badge, chakra} from '@chakra-ui/react';
import {TypeFamilleEnum} from 'shared/enum/typeFamilleEnum';

export const TYPE_FAMILLE_KEYS = {
  [TypeFamilleEnum["2nde_commune"]]: "info",
  [TypeFamilleEnum["1ere_commune"]]: "info",
  [TypeFamilleEnum["specialite"]]: "purpleGlycine",
  [TypeFamilleEnum["option"]]: "purpleGlycine",
};

export type TypeFamilleKeys = keyof typeof TYPE_FAMILLE_KEYS;

export const formatTypeFamilleLong = (typeFamille?: TypeFamilleKeys): string => {
  if (!typeFamille) {
    return "";
  }
  return typeFamille
    .replace(TypeFamilleEnum["2nde_commune"], "Seconde commune")
    .replace(TypeFamilleEnum["1ere_commune"], "Première année commune")
    .replace(TypeFamilleEnum["specialite"], "Spécialité")
    .replace(TypeFamilleEnum["option"], "Option")
    .replace("fermeture", "Fermeture au ");
};

export const formatTypeFamilleCourt = (typeFamille?: TypeFamilleKeys): string => {
  if (!typeFamille) {
    return "";
  }
  return typeFamille
    .replace(TypeFamilleEnum["2nde_commune"], "2de")
    .replace(TypeFamilleEnum["1ere_commune"], "1ère")
    .replace(TypeFamilleEnum["specialite"], "Spé")
    .replace(TypeFamilleEnum["option"], "Opt")
    .replace("fermeture", "Fermeture au ");
};


export const BadgeTypeFamille = chakra(({
  typeFamille,
  labelSize = "short",
  size = "xs",
  ...props
}: {
  typeFamille?: TypeFamilleKeys;
  labelSize?: "short" | "long";
  size: "xs" | "sm" | "md" | "lg";
  props?: BadgeProps;
}) => {
  if (!typeFamille) {
    return null;
  }

  const typeFamilleVariant = {
    [TypeFamilleEnum["2nde_commune"]]: "info",
    [TypeFamilleEnum["1ere_commune"]]: "info",
    [TypeFamilleEnum["specialite"]]: "purpleGlycine",
    [TypeFamilleEnum["option"]]: "purpleGlycine",
  }[typeFamille];

  return (
    <Badge
      variant={typeFamilleVariant}
      h={"fit-content"}
      flex={"shrink"}
      size={size}
      {...props}
    >
      {labelSize === "short" ? formatTypeFamilleCourt(typeFamille) : formatTypeFamilleLong(typeFamille)}
    </Badge>
  );
});
