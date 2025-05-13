import { Badge } from "@chakra-ui/react";
import {TypeFamilleEnum} from 'shared/enum/typeFamilleEnum';

export const TYPE_FAMILLE_KEYS = {
  [TypeFamilleEnum["2nde_commune"]]: "info",
  [TypeFamilleEnum["1ere_commune"]]: "info",
  [TypeFamilleEnum["specialite"]]: "purpleGlycine",
  [TypeFamilleEnum["option"]]: "purpleGlycine",
  ["fermeture"]: "grey",
};

export type TypeFamilleKeys = keyof typeof TYPE_FAMILLE_KEYS;

export const formatTypeFamilleLong = (typeFamille: TypeFamilleKeys): string => {
  return typeFamille
    .replace(TypeFamilleEnum["2nde_commune"], "Seconde commune")
    .replace(TypeFamilleEnum["1ere_commune"], "Première année commune")
    .replace(TypeFamilleEnum["specialite"], "Spécialité")
    .replace(TypeFamilleEnum["option"], "Option")
    .replace("fermeture", "Fermeture au ");
};

export const formatTypeFamilleCourt = (typeFamille: TypeFamilleKeys): string => {
  return typeFamille
    .replace(TypeFamilleEnum["2nde_commune"], "2de")
    .replace(TypeFamilleEnum["1ere_commune"], "1ère")
    .replace(TypeFamilleEnum["specialite"], "Spé")
    .replace(TypeFamilleEnum["option"], "Opt")
    .replace("fermeture", "Fermeture au ");
};


export const BadgeTypeFamille = ({
  typeFamille,
  labelSize = "short",
  size = "xs",
  fontSize,
  children,
}: {
  typeFamille?: TypeFamilleKeys;
  labelSize?: "short" | "long";
  size?: "xs" | "sm" | "md";
  fontSize?: string;
  children?: React.ReactNode;
}) => {
  if (!typeFamille) {
    return null;
  }

  const typeFamilleVariant = {
    [TypeFamilleEnum["2nde_commune"]]: "info",
    [TypeFamilleEnum["1ere_commune"]]: "info",
    [TypeFamilleEnum["specialite"]]: "purpleGlycine",
    [TypeFamilleEnum["option"]]: "purpleGlycine",
    ["fermeture"]: "grey",
  }[typeFamille];

  return (
    <Badge variant={typeFamilleVariant} size={size} fontSize={fontSize}>
      {labelSize === "short" ? formatTypeFamilleCourt(typeFamille) : formatTypeFamilleLong(typeFamille)}
      {children && <> {children}</>}
    </Badge>
  );
};
