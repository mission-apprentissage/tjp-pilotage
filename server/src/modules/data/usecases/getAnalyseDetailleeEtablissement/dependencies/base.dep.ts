import { CURRENT_RENTREE } from "shared";
import { VoieEnum } from "shared/enum/voieEnum";

import { getKbdClient } from "@/db/db";

export const getBase = ({ uai, rentreeScolaire = CURRENT_RENTREE }: { uai: string; rentreeScolaire?: string }) =>
  getKbdClient()
    .selectFrom("formationEtablissement")
    .innerJoin("dataEtablissement", "dataEtablissement.uai", "formationEtablissement.uai")
    .innerJoin("formationView", (join) =>
      join
        .onRef("formationView.cfd", "=", "formationEtablissement.cfd")
        .on("formationView.voie", "=", VoieEnum.scolaire)
    )
    .innerJoin("niveauDiplome", "niveauDiplome.codeNiveauDiplome", "formationView.codeNiveauDiplome")
    .leftJoin("dispositif", (join) =>
      join
        .onRef("dispositif.codeDispositif", "=", "formationEtablissement.codeDispositif")
        .on("formationEtablissement.voie", "=", VoieEnum.scolaire)
    )
    .leftJoin("indicateurEntree", (join) =>
      join
        .onRef("indicateurEntree.formationEtablissementId", "=", "formationEtablissement.id")
        .on("formationEtablissement.voie", "=", VoieEnum.scolaire)
    )
    .where((w) =>
      w.and([
        w.or([
          w("indicateurEntree.rentreeScolaire", "=", rentreeScolaire),
          w("indicateurEntree.rentreeScolaire", "is", null),
        ]),
        w("formationEtablissement.uai", "=", uai),
      ])
    );
