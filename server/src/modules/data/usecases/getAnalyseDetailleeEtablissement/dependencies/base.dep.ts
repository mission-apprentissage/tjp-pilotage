import { CURRENT_RENTREE } from "shared";

import { kdb } from "../../../../../db/db";

export const getBase = ({
  uai,
  rentreeScolaire = CURRENT_RENTREE,
}: {
  uai: string;
  rentreeScolaire?: string;
}) =>
  kdb
    .selectFrom("formationEtablissement")
    .innerJoin(
      "dataEtablissement",
      "dataEtablissement.uai",
      "formationEtablissement.UAI"
    )
    .innerJoin(
      "dataFormation",
      "dataFormation.cfd",
      "formationEtablissement.cfd"
    )
    .innerJoin(
      "niveauDiplome as nd",
      "nd.codeNiveauDiplome",
      "dataFormation.codeNiveauDiplome"
    )
    .leftJoin("dispositif", (join) =>
      join
        .onRef(
          "dispositif.codeDispositif",
          "=",
          "formationEtablissement.dispositifId"
        )
        .on("formationEtablissement.voie", "=", "scolaire")
    )
    .leftJoin("indicateurEntree", (join) =>
      join
        .onRef(
          "indicateurEntree.formationEtablissementId",
          "=",
          "formationEtablissement.id"
        )
        .on("formationEtablissement.voie", "=", "scolaire")
    )
    .where((w) =>
      w.and([
        w.or([
          w("indicateurEntree.rentreeScolaire", "=", rentreeScolaire),
          w("indicateurEntree.rentreeScolaire", "is", null),
        ]),
        w("formationEtablissement.UAI", "=", uai),
      ])
    );
