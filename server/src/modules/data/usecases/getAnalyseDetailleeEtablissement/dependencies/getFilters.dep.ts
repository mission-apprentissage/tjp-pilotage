import { sql } from "kysely";

import { cleanNull } from "../../../../../utils/noNull";
import { getBase } from "./base.dep";

export const getFilters = async ({ uai }: { uai: string }) =>
  getBase({
    uai,
  })
    .select((eb) => [
      "libelleNiveauDiplome as label",
      "dataFormation.codeNiveauDiplome as value",
      sql<number>`COUNT(DISTINCT CONCAT(
             ${eb.ref("dataEtablissement.uai")},
             ${eb.ref("dataFormation.cfd")},
             COALESCE(${eb.ref("formationEtablissement.dispositifId")},''),
             ${eb.ref("formationEtablissement.voie")}
           ))`.as("nbOffres"),
    ])
    .groupBy(["label", "value"])
    .orderBy(["label asc"])
    .$castTo<{
      label: string;
      value: string;
      nbOffres: number;
    }>()
    .execute()
    .then((filters) =>
      cleanNull({
        diplomes: filters.map(cleanNull),
      })
    );
