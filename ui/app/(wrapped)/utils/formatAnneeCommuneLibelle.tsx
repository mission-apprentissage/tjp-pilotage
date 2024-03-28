import { Flex } from "@chakra-ui/react";
import { ReactNode } from "react";

import { BadgeTypeFamille } from "../../../components/BadgeTypeFamille";

export const formatAnneeCommuneLibelle = (formation: {
  libelleFormation?: string;
  typeFamille?: string;
}) => {
  switch (formation.typeFamille) {
    case "2nde_commune":
      return format2ndeCommuneLibelle(
        formation.libelleFormation,
        formation.typeFamille
      );
    case "1ere_commune":
      return format1ereCommuneLibelle(formation.libelleFormation);
    case "specialite":
      return formatSpecialiteLibelle(formation.libelleFormation);
    case "option":
      return formatOptionLibelle(formation.libelleFormation);
    default:
      return formation.libelleFormation ?? "-";
  }
};

export const format2ndeCommuneLibelle = (
  libelleFormation?: string,
  typeFamille?: string
): ReactNode => (
  <Flex alignItems={"center"} gap={2}>
    {libelleFormation?.replace(" 2nde commune", "")}
    <BadgeTypeFamille typeFamille={typeFamille} />
  </Flex>
);

export const format1ereCommuneLibelle = (
  libelleFormation?: string,
  typeFamille?: string
): ReactNode => (
  <Flex alignItems={"center"} gap={2}>
    {libelleFormation?.replace(" 1ere annee commune", "")}
    <BadgeTypeFamille typeFamille={typeFamille} />
  </Flex>
);

export const formatSpecialiteLibelle = (
  libelleFormation?: string,
  typeFamille?: string
): ReactNode => (
  <Flex alignItems={"center"} gap={2}>
    {libelleFormation}
    <BadgeTypeFamille typeFamille={typeFamille} />
  </Flex>
);

export const formatOptionLibelle = (
  libelleFormation?: string,
  typeFamille?: string
): ReactNode => (
  <Flex alignItems={"center"} gap={2}>
    {libelleFormation}
    <BadgeTypeFamille typeFamille={typeFamille} />
  </Flex>
);
