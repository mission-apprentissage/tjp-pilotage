import { Tag } from "@chakra-ui/react";
import { ReactNode } from "react";

export const formatAnneeCommuneLibelle = (formation: {
  libelleFormation?: string;
  typeFamille?: string;
}) => (
  <>
    {formation.typeFamille === "2nde_commune"
      ? format2ndeCommuneLibelle(formation.libelleFormation)
      : formation.typeFamille === "1ere_commune"
      ? format1ereCommuneLibelle(formation.libelleFormation)
      : formation.typeFamille === "specialite"
      ? formatSpecialiteLibelle(formation.libelleFormation)
      : formation.typeFamille === "option"
      ? formatOptionLibelle(formation.libelleFormation)
      : formation.libelleFormation ?? "-"}
  </>
);

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
