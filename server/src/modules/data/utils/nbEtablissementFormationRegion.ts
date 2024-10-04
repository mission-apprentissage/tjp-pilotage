import { ExpressionBuilder, sql } from "kysely";

import { DB } from "../../../db/db";

export const nbEtablissementFormationRegion = ({
  eb,
  rentreeScolaire,
}: {
  eb: ExpressionBuilder<DB, "demande">;
  rentreeScolaire: string;
}) => {
  return eb
    .selectFrom("formationEtablissement")
    .leftJoin("indicateurEntree", (join) =>
      join
        .onRef(
          "indicateurEntree.formationEtablissementId",
          "=",
          "formationEtablissement.id"
        )
        .on("indicateurEntree.rentreeScolaire", "=", rentreeScolaire)
    )
    .leftJoin(
      "etablissement",
      "etablissement.uai",
      "formationEtablissement.uai"
    )
    .whereRef("etablissement.codeRegion", "=", "demande.codeRegion")
    .whereRef("formationEtablissement.cfd", "=", "demande.cfd")
    .whereRef(
      "formationEtablissement.codeDispositif",
      "=",
      "demande.codeDispositif"
    )
    .where("indicateurEntree.rentreeScolaire", "=", rentreeScolaire)
    .select((eb2) =>
      sql<number>`count(${eb2.ref("formationEtablissement.uai")})`.as("nbEtab")
    );
};
