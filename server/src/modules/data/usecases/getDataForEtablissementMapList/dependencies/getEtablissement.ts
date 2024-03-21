import { z } from "zod";

import { kdb } from "../../../../../db/db";
import { getDataForEtablissementMapListSchema } from "../getDataForEtablissementMapList.schema";

export interface Filters
  extends z.infer<typeof getDataForEtablissementMapListSchema.params> {}

export const getEtablissement = async ({ uai }: Filters) =>
  await kdb
    .selectFrom("etablissement")
    .leftJoin(
      "formationEtablissement",
      "formationEtablissement.UAI",
      "etablissement.UAI"
    )
    .leftJoin(
      "indicateurEntree",
      "indicateurEntree.formationEtablissementId",
      "formationEtablissement.id"
    )
    .leftJoin(
      "dispositif",
      "dispositif.codeDispositif",
      "formationEtablissement.dispositifId"
    )
    .distinct()
    .select([
      "formationEtablissement.voie",
      "dispositif.libelleDispositif",
      "etablissement.UAI",
      "etablissement.codeDepartement",
      "etablissement.commune",
      "etablissement.longitude",
      "etablissement.latitude",
      "etablissement.libelleEtablissement",
    ])
    .where("etablissement.UAI", "=", uai)
    .executeTakeFirstOrThrow();
