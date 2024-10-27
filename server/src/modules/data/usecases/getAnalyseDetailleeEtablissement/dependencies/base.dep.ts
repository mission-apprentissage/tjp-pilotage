import { CURRENT_RENTREE } from "shared";

import { getKbdClient } from "@/db/db";

export const getBase = ({ uai, rentreeScolaire = CURRENT_RENTREE }: { uai: string; rentreeScolaire?: string }) =>
  getKbdClient()
    .selectFrom("formationEtablissement")
    .innerJoin("dataEtablissement", "dataEtablissement.uai", "formationEtablissement.uai")
    .innerJoin("dataFormation", "dataFormation.cfd", "formationEtablissement.cfd")
    .innerJoin("niveauDiplome as nd", "nd.codeNiveauDiplome", "dataFormation.codeNiveauDiplome")
    .leftJoin("dispositif", (join) =>
      join
        .onRef("dispositif.codeDispositif", "=", "formationEtablissement.codeDispositif")
        .on("formationEtablissement.voie", "=", "scolaire")
    )
    .leftJoin("indicateurEntree", (join) =>
      join
        .onRef("indicateurEntree.formationEtablissementId", "=", "formationEtablissement.id")
        .on("formationEtablissement.voie", "=", "scolaire")
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
