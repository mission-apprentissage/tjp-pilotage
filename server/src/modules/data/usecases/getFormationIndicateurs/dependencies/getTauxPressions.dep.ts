import { ScopeEnum } from "shared";

import { getKbdClient } from "@/db/db";
import { selectTauxPressionAgg } from "@/modules/data/utils/tauxPression";
import { cleanNull } from "@/utils/noNull";

import { getFormationMailleEtab } from "./getFormationMailleEtab.dep";

export const getTauxPressions = async ({
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
  if (codeDepartement) scopes.push({ scope: ScopeEnum.département, codeDepartement });

  const results = await Promise.all(
    scopes.map(async ({ scope, codeRegion, codeAcademie, codeDepartement }) =>
      getKbdClient()
        .with("maille_etab", () =>
          getFormationMailleEtab({
            codeRegion,
            codeAcademie,
            codeDepartement,
          }),
        )
        .with("quatre_dernieres_rentrees", (wb) =>
          wb
            .selectFrom("indicateurEntree")
            .select("rentreeScolaire")
            .distinct()
            .orderBy("rentreeScolaire", "desc")
            .limit(4),
        )
        .selectFrom("maille_etab")
        .innerJoin("indicateurEntree", "indicateurEntree.formationEtablissementId", "maille_etab.id")
        .where("cfd", "=", cfd)
        .where("indicateurEntree.rentreeScolaire", "in", (sb) =>
          sb.selectFrom("quatre_dernieres_rentrees").select("rentreeScolaire"),
        )
        .groupBy(["rentreeScolaire", "libelleFormation"])
        .select((eb) => [
          eb.ref("rentreeScolaire").as("rentreeScolaire"),
          eb.val(scope).as("scope"),
          selectTauxPressionAgg("indicateurEntree", "maille_etab").as("value"),
        ])
        .orderBy("rentreeScolaire", "asc")
        .execute()
        .then(cleanNull),
    ),
  );

  return results.flat();
};
