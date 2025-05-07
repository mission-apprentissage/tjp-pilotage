import { Flex } from "@chakra-ui/react";
import type { ReactNode } from "react";
import {SecteurEnum} from 'shared/enum/secteurEnum';
import {TypeFamilleEnum} from 'shared/enum/typeFamilleEnum';

import type { TypeFamilleKeys } from "@/components/BadgeTypeFamille";
import { BadgeTypeFamille } from "@/components/BadgeTypeFamille";

import { formatArray } from "./formatUtils";

type LabelSizeType = "short" | "long";
type SizeType = "xs" | "sm" | "md";

export const formatFamilleMetierLibelle = (
  formation: {
    libelleFormation?: string;
    typeFamille?: string;
  },
  labelSize?: LabelSizeType,
  size?: SizeType,
  fontSize?: string,
): React.ReactNode => {
  switch (formation.typeFamille) {
  case TypeFamilleEnum["2nde_commune"]:
  case TypeFamilleEnum["1ere_commune"]:
    return formatAnneeCommuneLibelle({
      libelleFormation : formation.libelleFormation,
      typeFamille: formation.typeFamille,
      labelSize,
      size,
      fontSize
    });
  case TypeFamilleEnum["specialite"]:
  case TypeFamilleEnum["option"]:
    return formatSpecialiteOuOptionLibelle({
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

export const formatAnneeCommuneLibelle = (
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
    labelSize?: LabelSizeType,
    size?: SizeType,
    fontSize?: string
  }): ReactNode => (
  <Flex alignItems={"center"} gap={2}>
    {libelleFormation?.replace(" 2nde commune", "").replace(" 1ere annee commune", "")}
    <BadgeTypeFamille
      typeFamille={typeFamille as TypeFamilleKeys}
      labelSize={labelSize}
      size={size}
      fontSize={fontSize}
    />
  </Flex>
);

export const formatSpecialiteOuOptionLibelle = (
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
    labelSize?: LabelSizeType,
    size?: SizeType,
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
  if (secteur === SecteurEnum["PU"]) return "Public";
  if (secteur === SecteurEnum["PR"]) return "Privé";
  return secteur;
};

export const formatDispositifs = (dispositifs: string[]) => {
  return dispositifs
    .filter((libelle) => libelle !== "")
    .map((d) => {
      return d.replace(/\sen\s/i, " ").replace(/professionnel/i, "PRO");
    });
};
