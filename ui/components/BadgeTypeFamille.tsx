import { Badge } from "@chakra-ui/react";

import {
  formatTypeFamilleCourt,
  formatTypeFamilleLong,
} from "../app/(wrapped)/panorama/etablissement/components/analyse-detaillee/formatData";

export const BadgeTypeFamille = ({
  typeFamille,
  labelSize = "short",
  size = "xs",
}: {
  typeFamille?: string;
  labelSize?: "short" | "long";
  size?: "xs" | "sm" | "md";
}) => {
  if (!typeFamille) {
    return null;
  }

  const typeFamilleVariant = {
    ["2nde_commune"]: "info",
    ["1ere_commune"]: "info",
    ["specialite"]: "purpleGlycine",
    ["option"]: "purpleGlycine",
  }[typeFamille];

  return (
    <Badge variant={typeFamilleVariant} size={size}>
      {labelSize === "short"
        ? formatTypeFamilleCourt(typeFamille)
        : formatTypeFamilleLong(typeFamille)}
    </Badge>
  );
};
