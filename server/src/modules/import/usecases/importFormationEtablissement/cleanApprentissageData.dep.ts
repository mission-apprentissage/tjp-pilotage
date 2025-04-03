import { VoieEnum } from "shared";

import { getKbdClient } from "@/db/db";

// Suppression des données en apprentissage avant réimport depuis les fichiers sources
export const cleanApprentissageData = async () => {
  await getKbdClient()
    .deleteFrom("indicateurSortie")
    .using("formationEtablissement")
    .where(eb =>
      eb.and([
        eb(eb.ref("formationEtablissement.id"), "=", eb.ref("indicateurSortie.formationEtablissementId")),
        eb(eb.ref("formationEtablissement.voie"), "=", eb.val(VoieEnum.apprentissage))
      ])
    ).execute();

  await getKbdClient()
    .deleteFrom("indicateurEntree")
    .using("formationEtablissement")
    .where(eb =>
      eb.and([
        eb(eb.ref("formationEtablissement.id"), "=", eb.ref("indicateurEntree.formationEtablissementId")),
        eb(eb.ref("formationEtablissement.voie"), "=", eb.val(VoieEnum.apprentissage))
      ])
    ).execute();

  await getKbdClient()
    .deleteFrom("indicateurRegionSortie")
    .where(eb => eb("indicateurRegionSortie.voie", "=",eb.val(VoieEnum.apprentissage)))
    .execute();

  await getKbdClient()
    .deleteFrom("formationEtablissement")
    .where(eb =>
      eb.and([
        eb(eb.ref("formationEtablissement.voie"), "=", eb.val(VoieEnum.apprentissage))
      ])
    ).execute();
};
