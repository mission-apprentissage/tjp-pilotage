import { Tag } from "@chakra-ui/react";
import { ReactNode } from "react";

export const formatAnneeCommuneLibelle = (formation: {
  libelleFormation?: string;
  typeFamille?: string;
}) => {
  switch (formation.typeFamille) {
    case "2nde_commune":
      return format2ndeCommuneLibelle(formation.libelleFormation);
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
  libelleFormation?: string
): ReactNode => (
  <>
    {libelleFormation?.replace(" 2nde commune", "")}
    <Tag
      colorScheme={"blue"}
      size={"sm"}
      ms={2}
      minW="fit-content"
      maxH={"1rem"}
    >
      2nde commune
    </Tag>
  </>
);

export const format1ereCommuneLibelle = (
  libelleFormation?: string
): ReactNode => (
  <>
    {libelleFormation?.replace(" 1ere annee commune", "")}
    <Tag
      colorScheme={"blue"}
      size={"sm"}
      ms={2}
      minW="fit-content"
      maxH={"1rem"}
    >
      1ère commune
    </Tag>
  </>
);

export const formatSpecialiteLibelle = (
  libelleFormation?: string
): ReactNode => (
  <>
    {libelleFormation}
    <Tag
      colorScheme={"blue"}
      size={"sm"}
      ms={2}
      minW="fit-content"
      maxH={"1rem"}
    >
      spécialité
    </Tag>
  </>
);

export const formatOptionLibelle = (libelleFormation?: string): ReactNode => (
  <>
    {libelleFormation}
    <Tag
      colorScheme={"blue"}
      size={"sm"}
      ms={2}
      minW="fit-content"
      maxH={"1rem"}
    >
      option
    </Tag>
  </>
);
