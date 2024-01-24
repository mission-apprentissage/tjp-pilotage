import { ExpressionBuilder, expressionBuilder, RawBuilder, sql } from "kysely";
import { CURRENT_RENTREE } from "shared";

import { DB } from "../../../db/schema";

const capaciteAnnee = (
  annee: RawBuilder<unknown>,
  indicateurEntreeAlias: string
) => {
  return sql`NULLIF((jsonb_extract_path(${sql.table(
    indicateurEntreeAlias
  )}."capacites",${annee})), 'null')::FLOAT`;
};

const premierVoeuxAnnee = (
  annee: RawBuilder<unknown>,
  indicateurEntreeAlias: string
) => {
  return sql`NULLIF((jsonb_extract_path(${sql.table(
    indicateurEntreeAlias
  )}."premiersVoeux",${annee})), 'null')::FLOAT`;
};

export const selectDenominateurPressionAgg = (
  indicateurEntreeAlias: string
) => sql<number>`
  SUM(
    CASE WHEN ${premierVoeuxAnnee(
      sql`${sql.table(indicateurEntreeAlias)}."anneeDebut"::text`,
      indicateurEntreeAlias
    )} IS NOT NULL
    THEN ${capaciteAnnee(
      sql`${sql.table(indicateurEntreeAlias)}."anneeDebut"::text`,
      indicateurEntreeAlias
    )}
    END
  )`;

export const selectTauxPressionAgg = (
  indicateurEntreeAlias: string
) => sql<number>`
    CASE WHEN ${selectDenominateurPressionAgg(indicateurEntreeAlias)} >= 0
    THEN ROUND((SUM(${premierVoeuxAnnee(
      sql`${sql.table(indicateurEntreeAlias)}."anneeDebut"::text`,
      indicateurEntreeAlias
    )})
    / ${selectDenominateurPressionAgg(indicateurEntreeAlias)})::NUMERIC, 2)
    END
  `;

export const selectDenominateurPression = (
  indicateurEntreeAlias: string
) => sql<number>`
    CASE WHEN ${capaciteAnnee(
      sql`${sql.table(indicateurEntreeAlias)}."anneeDebut"::text`,
      indicateurEntreeAlias
    )} IS NOT NULL
    THEN ${capaciteAnnee(
      sql`${sql.table(indicateurEntreeAlias)}."anneeDebut"::text`,
      indicateurEntreeAlias
    )}
    END`;

export const selectTauxPression = (
  indicateurEntreeAlias: string
) => sql<number>`
    CASE WHEN ${selectDenominateurPression(indicateurEntreeAlias)} >= 0
    THEN ROUND((
      ${premierVoeuxAnnee(
        sql`${sql.table(indicateurEntreeAlias)}."anneeDebut"::text`,
        indicateurEntreeAlias
      )}
    / ${selectDenominateurPression(indicateurEntreeAlias)})::NUMERIC, 2)
    END
  `;

export const selectTauxPressionParFormationEtParRegionDemande = ({
  eb,
  rentreeScolaire = CURRENT_RENTREE,
}: {
  eb: ExpressionBuilder<DB, "demande">;
  rentreeScolaire?: string;
}) => {
  return eb
    .selectFrom(
      tauxPressionFormationRegional({ eb, rentreeScolaire }).as(
        "pressionDetails"
      )
    )
    .innerJoin("region", "region.codeRegion", "pressionDetails.codeRegion")
    .innerJoin(
      "formation",
      "formation.codeFormationDiplome",
      "pressionDetails.codeFormationDiplome"
    )
    .whereRef("region.codeRegion", "=", "demande.codeRegion")
    .whereRef("formation.codeFormationDiplome", "=", "demande.cfd")
    .select(["pressionDetails.pression as pression"])
    .groupBy([
      "pressionDetails.codeFormationDiplome",
      "pressionDetails.codeRegion",
      "pressionDetails.pression",
      "region.codeRegion",
    ]);
};

export const tauxPressionFormationRegional = ({
  eb,
  rentreeScolaire = CURRENT_RENTREE,
}: {
  eb: ExpressionBuilder<DB, "demande">;
  rentreeScolaire?: string;
}) => {
  return eb
    .selectFrom("formation")
    .leftJoin(
      "formationEtablissement",
      "formationEtablissement.cfd",
      "formation.codeFormationDiplome"
    )
    .leftJoin(
      "etablissement",
      "etablissement.UAI",
      "formationEtablissement.UAI"
    )
    .leftJoin("region", "region.codeRegion", "etablissement.codeRegion")
    .innerJoin(
      "indicateurEntree",
      "indicateurEntree.formationEtablissementId",
      "formationEtablissement.id"
    )
    .whereRef("formation.codeFormationDiplome", "=", "demande.cfd")
    .whereRef(
      "formationEtablissement.dispositifId",
      "=",
      "demande.dispositifId"
    )
    .whereRef("region.codeRegion", "=", "demande.codeRegion")
    .where("indicateurEntree.rentreeScolaire", "=", rentreeScolaire)
    .select([
      selectTauxPressionAgg("indicateurEntree").as("pression"),
      "region.codeRegion",
      "formation.codeFormationDiplome",
    ])
    .groupBy([
      "formation.codeFormationDiplome",
      "formationEtablissement.dispositifId",
      "region.codeRegion",
    ]);
};

export const withTauxPressionReg = <
  EB extends ExpressionBuilder<DB, "demande" | "dataEtablissement">,
>({
  cfdRef,
  dispositifIdRef,
  codeRegionRef,
}: {
  eb: EB;
  codeRegion?: string | "ref";
  cfdRef: Parameters<EB["ref"]>[0];
  dispositifIdRef: Parameters<EB["ref"]>[0];
  codeRegionRef: Parameters<EB["ref"]>[0];
}) => {
  const eb = expressionBuilder<DB, keyof DB>();
  return eb
    .selectFrom("formationEtablissement as subFE")
    .innerJoin("indicateurEntree as subIE", (join) =>
      join
        .onRef("subFE.id", "=", "subIE.formationEtablissementId")
        .on("subIE.rentreeScolaire", "=", CURRENT_RENTREE)
    )
    .innerJoin("etablissement as subEtab", "subEtab.UAI", "subFE.UAI")
    .whereRef("subFE.cfd", "=", cfdRef)
    .whereRef("subFE.dispositifId", "=", dispositifIdRef)
    .whereRef(
      "subEtab.codeRegion",
      "=",
      sql`ANY(array_agg(${eb.ref(codeRegionRef)}))`
    )
    .select([selectTauxPressionAgg("subIE").as("s")])
    .groupBy(["cfd", "dispositifId"]);
};
