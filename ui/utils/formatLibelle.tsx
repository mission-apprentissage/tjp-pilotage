import { Flex } from "@chakra-ui/react";
import type { ReactNode } from "react";

import type { TypeFamilleKeys } from "@/components/BadgeTypeFamille";
import { BadgeTypeFamille } from "@/components/BadgeTypeFamille";

import { formatArray } from "./formatUtils";

export const formatAnneeCommuneLibelle = (
  formation: {
    libelleFormation?: string;
    typeFamille?: string;
  },
  labelSize?: "short" | "long",
  size?: "xs" | "sm" | "md",
  fontSize?: string,
): React.ReactNode => {
  switch (formation.typeFamille) {
  case "2nde_commune":
    return format2ndeCommuneLibelle({
      libelleFormation: formation.libelleFormation,
      typeFamille: formation.typeFamille,
      labelSize,
      size,
      fontSize
    });
  case "1ere_commune":
    return format1ereCommuneLibelle({
      libelleFormation : formation.libelleFormation,
      typeFamille: formation.typeFamille,
      labelSize,
      size,
      fontSize
    });
  case "specialite":
    return formatSpecialiteLibelle({
      libelleFormation : formation.libelleFormation,
      typeFamille: formation.typeFamille,
      labelSize,
      size,
      fontSize
    });
  case "option":
    return formatOptionLibelle({
      libelleFormation : formation.libelleFormation,
      typeFamille: formation.typeFamille,
      labelSize,
      size,
      fontSize
    });
  default:
    return formation.libelleFormation ?? "-";
  }
};

export const format2ndeCommuneLibelle = (
  {
    libelleFormation,
    typeFamille,
    labelSize = "short",
    size = "xs",
    fontSize,
  }
  : {
    libelleFormation?: string,
    typeFamille?: string,
    labelSize?: "short" | "long",
    size?: "xs" | "sm" | "md",
    fontSize?: string
  }): ReactNode => (
  <Flex alignItems={"center"} gap={2}>
    {libelleFormation?.replace(" 2nde commune", "")}
    <BadgeTypeFamille
      typeFamille={typeFamille as TypeFamilleKeys}
      labelSize={labelSize}
      size={size}
      fontSize={fontSize}
    />
  </Flex>
);

export const format1ereCommuneLibelle = (
  {
    libelleFormation,
    typeFamille,
    labelSize = "short",
    size = "xs",
    fontSize,
  }
  : {
    libelleFormation?: string,
    typeFamille?: string,
    labelSize?: "short" | "long",
    size?: "xs" | "sm" | "md",
    fontSize?: string
}): ReactNode => (
  <Flex alignItems={"center"} gap={2}>
    {libelleFormation?.replace(" 1ere annee commune", "")}
    <BadgeTypeFamille
      typeFamille={typeFamille as TypeFamilleKeys}
      labelSize={labelSize}
      size={size}
      fontSize={fontSize}
    />
  </Flex>
);

export const formatSpecialiteLibelle = (
  {
    libelleFormation,
    typeFamille,
    labelSize = "short",
    size = "xs",
    fontSize,
  }
  : {
    libelleFormation?: string,
    typeFamille?: string,
    labelSize?: "short" | "long",
    size?: "xs" | "sm" | "md",
    fontSize?: string
}): ReactNode => (
  <Flex alignItems={"center"} gap={2}>
    {libelleFormation}
    <BadgeTypeFamille
      typeFamille={typeFamille as TypeFamilleKeys}
      labelSize={labelSize}
      size={size}
      fontSize={fontSize}
    />
  </Flex>
);

export const formatOptionLibelle = (
  {
    libelleFormation,
    typeFamille,
    labelSize = "short",
    size = "xs",
    fontSize,
  }
  : {
    libelleFormation?: string,
    typeFamille?: string,
    labelSize?: "short" | "long",
    size?: "xs" | "sm" | "md",
    fontSize?: string
}): ReactNode => (
  <Flex alignItems={"center"} gap={2}>
    {libelleFormation}
    <BadgeTypeFamille
      typeFamille={typeFamille as TypeFamilleKeys}
      labelSize={labelSize}
      size={size}
      fontSize={fontSize}
    />
  </Flex>
);

export const formatCodeDepartement = (codeDepartement?: string) =>
  codeDepartement?.startsWith("0") ? codeDepartement.substring(1) : codeDepartement;

export const formatCommuneLibelleWithCodeDepartement = ({
  commune,
  codeDepartement,
}: {
  commune?: string;
  codeDepartement?: string;
}) => {
  return `${commune} (${formatCodeDepartement(codeDepartement)})`;
};

export const formatDepartementLibelleWithCodeDepartement = ({
  libelleDepartement,
  codeDepartement,
}: {
  libelleDepartement?: string;
  codeDepartement?: string;
}) => {
  return `${libelleDepartement} (${formatCodeDepartement(codeDepartement)})`;
};

export const formatLibelleFormation = (etablissement: { libellesDispositifs: string[]; libelleFormation: string }) => {
  const dispositifs =
    formatArray(etablissement.libellesDispositifs) !== "" ? `(${formatArray(etablissement.libellesDispositifs)})` : "";
  return `${etablissement.libelleFormation} ${dispositifs}`;
};

/**
 * Format le secteur en "Public" ou "Privé"
 * @param secteur - PU, PR
 * @returns Public, Privé
 */
export const formatSecteur = (secteur: string) => {
  if (secteur === "PU") return "Public";
  if (secteur === "PR") return "Privé";
  return secteur;
};

export const formatDispositifs = (dispositifs: string[]) => {
  return dispositifs
    .filter((libelle) => libelle !== "")
    .map((d) => {
      return d.replace(/\sen\s/i, " ").replace(/professionnel/i, "PRO");
    });
};
