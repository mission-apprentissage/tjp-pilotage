import { ScopeEnum } from "shared";

import { kdb } from "../../../../../db/db";
import { cleanNull } from "../../../../../utils/noNull";
import { selectTauxRemplissageAgg } from "../../../utils/tauxRemplissage";
import { getFormationMailleEtab } from "./getFormationMailleEtab.dep";

export const getTauxRemplissages = async ({
  cfd,
  codeRegion,
  codeAcademie,
  codeDepartement,
}: {
  cfd: string;
  codeRegion?: string;
  codeAcademie?: string;
  codeDepartement?: string;
}) => {
  const scopes: {
    scope: string;
    codeRegion?: string;
    codeAcademie?: string;
    codeDepartement?: string;
  }[] = [{ scope: ScopeEnum.national }];

  if (codeRegion) scopes.push({ scope: ScopeEnum.région, codeRegion });
  if (codeAcademie) scopes.push({ scope: ScopeEnum.académie, codeAcademie });
  if (codeDepartement)
    scopes.push({ scope: ScopeEnum.département, codeDepartement });

  const results = await Promise.all(
    scopes.map(({ scope, codeRegion, codeAcademie, codeDepartement }) =>
      kdb
        .with("maille_etab", () =>
          getFormationMailleEtab({
            codeRegion,
            codeAcademie,
            codeDepartement,
          })
        )
        .selectFrom("maille_etab")
        .innerJoin(
          "indicateurEntree",
          "indicateurEntree.formationEtablissementId",
          "maille_etab.id"
        )
        .where("cfd", "=", cfd)
        .where("rentreeScolaire", ">", "2020")
        .groupBy(["rentreeScolaire", "libelleFormation"])
        .select((eb) => [
          eb.ref("rentreeScolaire").as("rentreeScolaire"),
          eb.val(scope).as("scope"),
          selectTauxRemplissageAgg("indicateurEntree").as("value"),
        ])
        .orderBy("rentreeScolaire", "asc")
        .execute()
        .then(cleanNull)
    )
  );

  return results.flat();
};
