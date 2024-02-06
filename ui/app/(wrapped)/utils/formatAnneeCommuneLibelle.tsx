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
      : formation.libelleFormation ?? "-"}
  </>
);

export const format2ndeCommuneLibelle = (
  libelleFormation?: string
): ReactNode => (
  <>
    {libelleFormation?.indexOf(" 2nde commune") != -1
      ? libelleFormation?.replace(" 2nde commune", "")
      : libelleFormation}
    <Tag colorScheme={"blue"} size={"sm"} ms={2}>
      2nde commune
    </Tag>
  </>
);

export const format1ereCommuneLibelle = (
  libelleFormation?: string
): ReactNode => (
  <>
    {libelleFormation?.indexOf(" 1ere annee commune") != -1
      ? libelleFormation?.replace(" 1ere annee commune", "")
      : libelleFormation}
    <Tag colorScheme={"blue"} size={"sm"} ms={2}>
      1ère commune
    </Tag>
  </>
);
