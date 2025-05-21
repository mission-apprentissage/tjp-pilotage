import { Flex } from "@chakra-ui/react";
import type { ReactNode } from "react";
import type {Role} from "shared";
import { RoleEnum } from "shared";
import {SecteurEnum} from 'shared/enum/secteurEnum';
import type {TypeFamille} from 'shared/enum/typeFamilleEnum';
import { TypeFamilleEnum} from 'shared/enum/typeFamilleEnum';

import { BadgeTypeFamille } from "@/components/BadgeTypeFamille";

import { formatArray } from "./formatUtils";

type LabelSizeType = "short" | "long";
type SizeType = "xs" | "sm" | "md";
type Formation = {
  libelleFormation?: string;
  isFormationRenovee?: boolean;
  formationRenovee?: string;
  typeFamille?: TypeFamille;
}

export const formatFamilleMetierLibelle = ({
  formation,
  labelSize,
  size,
  fontSize,
  withBadge = true,
}:{
  formation: Formation,
  labelSize?: LabelSizeType,
  size?: SizeType,
  fontSize?: string,
  withBadge?: boolean
}): React.ReactNode => {
  switch (formation.typeFamille) {
  case TypeFamilleEnum["2nde_commune"]:
  case TypeFamilleEnum["1ere_commune"]:
    return formatAnneeCommuneLibelle({
      libelleFormation : formation.libelleFormation,
      typeFamille: formation.typeFamille,
      labelSize,
      size,
      fontSize,
      withBadge,
    });
  case TypeFamilleEnum["specialite"]:
  case TypeFamilleEnum["option"]:
    return formatSpecialiteOuOptionLibelle({
      libelleFormation : formation.libelleFormation,
      typeFamille: formation.typeFamille,
      labelSize,
      size,
      fontSize,
      withBadge,
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
    withBadge = true,
  }
  : {
    libelleFormation?: string,
    typeFamille?: TypeFamille,
    labelSize?: LabelSizeType,
    size?: SizeType,
    fontSize?: string
    withBadge?: boolean
  }): ReactNode => (
  <Flex alignItems={"center"} gap={2}>
    {libelleFormation?.replace(" 2nde commune", "").replace(" 1ere annee commune", "")}
    {withBadge && (
      <BadgeTypeFamille
        typeFamille={typeFamille}
        labelSize={labelSize}
        size={size}
        fontSize={fontSize}
      />)
    }
  </Flex>
);

export const formatSpecialiteOuOptionLibelle = (
  {
    libelleFormation,
    typeFamille,
    labelSize = "short",
    size = "xs",
    fontSize,
    withBadge = true,
  }
  : {
    libelleFormation?: string,
    typeFamille?: TypeFamille,
    labelSize?: LabelSizeType,
    size?: SizeType,
    fontSize?: string
    withBadge?: boolean
}): ReactNode => (
  <Flex alignItems={"center"} gap={2}>
    {libelleFormation}
    {withBadge && (
      <BadgeTypeFamille
        typeFamille={typeFamille}
        labelSize={labelSize}
        size={size}
        fontSize={fontSize}
      />
    )}
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

export const formatLibelleFormationWithDispositifs = (
  {libellesDispositifs, libelleFormation}:
  { libellesDispositifs: string[]; libelleFormation: string }
) => {
  const dispositifs =
    formatArray(libellesDispositifs) !== "" ? `(${formatArray(libellesDispositifs)})` : "";
  return `${libelleFormation} ${dispositifs}`;
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

export const formatLibelleFormationWithoutTags = (formation: Formation): string =>
  formation.libelleFormation ?
    formation.libelleFormation
      .replace("2nde commune", "")
      .replace("2nde année commune", "")
      .replace("1ere annee commune", "")
      .replace("1e annee commune", "")
      .trim()
    : "";

export const formatMillesime = (millesime: string): string =>
  `${millesime.split("_")[0]}+${millesime.split("_")[1].substring(2)}`;

export const formatRole = (role: Role) => {
  switch (role) {
  case RoleEnum["admin"]:
    return "Administrateur";
  case RoleEnum["admin_region"]:
    return "Administrateur région";
  case RoleEnum["expert_region"]:
    return "Expert région";
  case RoleEnum["gestionnaire_region"]:
    return "Gestionnaire région";
  case RoleEnum["pilote"]:
    return "Pilote national";
  case RoleEnum["pilote_region"]:
    return "Pilote région";
  case RoleEnum["perdir"]:
    return "PERDIR / Chef d'établissement";
  case RoleEnum["region"]:
    return "Région";
  case RoleEnum["invite"]:
    return "Invité";
  default:
    return "Inconnu";
  }
};
