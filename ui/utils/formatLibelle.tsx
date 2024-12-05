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
  size?: "xs" | "sm" | "md"
): React.ReactNode => {
  switch (formation.typeFamille) {
    case "2nde_commune":
      return format2ndeCommuneLibelle(formation.libelleFormation, formation.typeFamille, labelSize, size);
    case "1ere_commune":
      return format1ereCommuneLibelle(formation.libelleFormation, formation.typeFamille, labelSize, size);
    case "specialite":
      return formatSpecialiteLibelle(formation.libelleFormation, formation.typeFamille, labelSize, size);
    case "option":
      return formatOptionLibelle(formation.libelleFormation, formation.typeFamille, labelSize, size);
    default:
      return formation.libelleFormation ?? "-";
  }
};

export const format2ndeCommuneLibelle = (
  libelleFormation?: string,
  typeFamille?: string,
  labelSize?: "short" | "long",
  size?: "xs" | "sm" | "md"
): ReactNode => (
  <Flex alignItems={"center"} gap={2}>
    {libelleFormation?.replace(" 2nde commune", "")}
    <BadgeTypeFamille typeFamille={typeFamille as TypeFamilleKeys} labelSize={labelSize} size={size} />
  </Flex>
);

export const format1ereCommuneLibelle = (
  libelleFormation?: string,
  typeFamille?: string,
  labelSize?: "short" | "long",
  size?: "xs" | "sm" | "md"
): ReactNode => (
  <Flex alignItems={"center"} gap={2}>
    {libelleFormation?.replace(" 1ere annee commune", "")}
    <BadgeTypeFamille typeFamille={typeFamille as TypeFamilleKeys} labelSize={labelSize} size={size} />
  </Flex>
);

export const formatSpecialiteLibelle = (
  libelleFormation?: string,
  typeFamille?: string,
  labelSize?: "short" | "long",
  size?: "xs" | "sm" | "md"
): ReactNode => (
  <Flex alignItems={"center"} gap={2}>
    {libelleFormation}
    <BadgeTypeFamille typeFamille={typeFamille as TypeFamilleKeys} labelSize={labelSize} size={size} />
  </Flex>
);

export const formatOptionLibelle = (
  libelleFormation?: string,
  typeFamille?: string,
  labelSize?: "short" | "long",
  size?: "xs" | "sm" | "md"
): ReactNode => (
  <Flex alignItems={"center"} gap={2}>
    {libelleFormation}
    <BadgeTypeFamille typeFamille={typeFamille as TypeFamilleKeys} labelSize={labelSize} size={size} />
  </Flex>
);

export const formatCodeDepartement = (codeDepartement?: string) =>
  codeDepartement?.substring(0, 1) === "0" ? codeDepartement.substring(1) : codeDepartement;

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
