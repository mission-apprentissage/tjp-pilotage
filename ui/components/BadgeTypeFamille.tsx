import { Badge } from "@chakra-ui/react";

import {
  formatTypeFamilleCourt,
  formatTypeFamilleLong,
} from "@/app/(wrapped)/panorama/etablissement/components/analyse-detaillee/formatData";

export const TYPE_FAMILL_KEYS = {
  ["2nde_commune"]: "info",
  ["1ere_commune"]: "info",
  ["specialite"]: "purpleGlycine",
  ["option"]: "purpleGlycine",
  ["fermeture"]: "grey",
};

export type TypeFamilleKeys = keyof typeof TYPE_FAMILL_KEYS;

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
    ["2nde_commune"]: "info",
    ["1ere_commune"]: "info",
    ["specialite"]: "purpleGlycine",
    ["option"]: "purpleGlycine",
    ["fermeture"]: "grey",
  }[typeFamille];

  return (
    <Badge variant={typeFamilleVariant} size={size} fontSize={fontSize}>
      {labelSize === "short" ? formatTypeFamilleCourt(typeFamille) : formatTypeFamilleLong(typeFamille)}
      {children && <> {children}</>}
    </Badge>
  );
};
