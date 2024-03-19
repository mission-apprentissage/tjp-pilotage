import Boom from "@hapi/boom";

import { kdb } from "../../../../../db/db";
import { cleanNull } from "../../../../../utils/noNull";
export const getEtablissement = async ({ uai }: { uai: string }) =>
  kdb
    .selectFrom("dataEtablissement")
    .where("uai", "=", uai)
    .where("codeRegion", "is not", null)
    .where("codeAcademie", "is not", null)
    .where("codeDepartement", "is not", null)
    .select([
      "uai",
      "libelleEtablissement",
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