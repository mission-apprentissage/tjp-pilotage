import type { BadgeProps } from "@chakra-ui/react";
import {Badge, chakra} from '@chakra-ui/react';
import {TypeFamilleEnum} from 'shared/enum/typeFamilleEnum';

import {
  formatTypeFamilleCourt,
  formatTypeFamilleLong,
} from "@/app/(wrapped)/panorama/etablissement/components/analyse-detaillee/formatData";

export const TYPE_FAMILLE_KEYS = {
  [TypeFamilleEnum["2nde_commune"]]: "info",
  [TypeFamilleEnum["1ere_commune"]]: "info",
  [TypeFamilleEnum["specialite"]]: "purpleGlycine",
  [TypeFamilleEnum["option"]]: "purpleGlycine",
};

export type TypeFamilleKeys = keyof typeof TYPE_FAMILLE_KEYS;

export const BadgeTypeFamille = chakra(({
  typeFamille,
  labelSize = "short",
  size = "xs",
  fontSize,
  children,
  ...props
}: {
  typeFamille?: TypeFamilleKeys;
  labelSize?: "short" | "long";
  size?: "xs" | "sm" | "md";
  fontSize?: string;
  children?: React.ReactNode;
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
    <Badge variant={typeFamilleVariant} size={size} fontSize={fontSize} {...props}>
      {labelSize === "short" ? formatTypeFamilleCourt(typeFamille) : formatTypeFamilleLong(typeFamille)}
      {children && <> {children}</>}
    </Badge>
  );
});
