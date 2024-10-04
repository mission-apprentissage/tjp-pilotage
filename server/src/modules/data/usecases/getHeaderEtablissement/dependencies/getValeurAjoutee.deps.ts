import { MILLESIMES_IJ_ETAB } from "shared/time/millesimes";

import { kdb } from "../../../../../db/db";
import { cleanNull } from "../../../../../utils/noNull";

export const getValeurAjoutee = async ({
  uai,
  millesime = MILLESIMES_IJ_ETAB,
}: {
  uai: string;
  millesime?: string[];
}) =>
  kdb
    .selectFrom("indicateurEtablissement")
    .where("indicateurEtablissement.uai", "=", uai)
    .where("millesime", "in", millesime)
    .select((eb) => [
      eb.ref("indicateurEtablissement.uai").as("uai"),
      eb.ref("millesime").as("millesime"),
      eb.ref("valeurAjoutee").as("valeurAjoutee"),
    ])
    .orderBy("millesime", "desc")
    .execute()
    .then(cleanNull);
