import Boom from "@hapi/boom";
import { sql } from "kysely";

import { getKbdClient } from "@/db/db";
import { cleanNull } from "@/utils/noNull";

export const getEtablissement = async ({ uai }: { uai: string }) =>
  getKbdClient()
    .selectFrom("dataEtablissement")
    .where("dataEtablissement.uai", "=", uai)
    .where("codeRegion", "is not", null)
    .where("codeAcademie", "is not", null)
    .where("codeDepartement", "is not", null)
    .select((eb) => [
      "dataEtablissement.uai",
      sql<string>`coalesce(${eb.ref("libelleEtablissement")}, 'Sans libellé')`.as("libelleEtablissement"),
      "codeRegion",
      "codeAcademie",
      "codeDepartement",
    ])
    .$castTo<{
      uai: string;
      libelleEtablissement: string;
      codeRegion: string;
      codeAcademie: string;
      codeDepartement: string;
    }>()
    .executeTakeFirstOrThrow()
    .catch(() => {
      throw Boom.notFound(`Uai introuvable : ${uai}`);
    })
    .then(cleanNull);
