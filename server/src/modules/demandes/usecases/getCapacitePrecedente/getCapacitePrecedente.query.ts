
import { CURRENT_RENTREE, VoieEnum } from "shared";

import { getKbdClient } from "@/db/db";
import { capaciteAnnee } from "@/modules/data/utils/capaciteAnnee";
import { cleanNull } from "@/utils/noNull";

import type {Filters} from './getCapacitePrecedente.usecase';


export const getCapacitePrecedenteQuery = async (
  { cfd, codeDispositif, uai} :
  Filters
) => await getKbdClient()
  .selectFrom("formationEtablissement")
  .leftJoin("indicateurEntree", "formationEtablissement.id", "indicateurEntree.formationEtablissementId")
  .where((eb) =>
    eb.and([
      eb("formationEtablissement.voie", "=", VoieEnum["scolaire"]),
      eb("formationEtablissement.cfd", "=", cfd),
      eb("formationEtablissement.codeDispositif", "=", codeDispositif),
      eb("formationEtablissement.uai", "=", uai),
      eb("indicateurEntree.rentreeScolaire", "=", CURRENT_RENTREE),
    ])
  )
  .select([
    capaciteAnnee({alias: "indicateurEntree"}).as("capacite"),
  ])
  .executeTakeFirst()
  .then(cleanNull);
