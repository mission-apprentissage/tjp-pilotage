import { ExpressionBuilder, RawBuilder, sql } from "kysely";

import { DB } from "../../../db/db";

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
  rentreeScolaire = "2022",
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
    .innerJoin("formationView", "formationView.cfd", "pressionDetails.cfd")
    .whereRef("region.codeRegion", "=", "demande.codeRegion")
    .whereRef("formationView.cfd", "=", "demande.cfd")
    .select(["pressionDetails.pression as pression"])
    .groupBy([
      "pressionDetails.cfd",
      "pressionDetails.codeRegion",
      "pressionDetails.pression",
      "region.codeRegion",
    ]);
};

export const tauxPressionFormationRegional = ({
  eb,
  rentreeScolaire = "2022",
}: {
  eb: ExpressionBuilder<DB, "demande">;
  rentreeScolaire?: string;
}) => {
  return eb
    .selectFrom("formationView")
    .leftJoin(
      "formationEtablissement",
      "formationEtablissement.cfd",
      "formationView.cfd"
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
    .whereRef("formationView.cfd", "=", "demande.cfd")
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
      "formationView.cfd",
    ])
    .groupBy([
      "formationView.cfd",
      "formationEtablissement.dispositifId",
      "region.codeRegion",
    ]);
};

type EbRef<EB extends ExpressionBuilder<DB, never>> = Parameters<EB["ref"]>[0];

export const withTauxPressionReg = <EB extends ExpressionBuilder<DB, never>>({
  eb,
  cfdRef,
  codeDispositifRef,
  codeRegionRef,
}: {
  eb: EB;
  codeRegion?: string | "ref";
  cfdRef: EbRef<EB>;
  codeDispositifRef: EbRef<EB>;
  codeRegionRef: EbRef<EB>;
}) => {
  return eb
    .selectFrom("formationEtablissement as subFE")
    .innerJoin("indicateurEntree as subIE", (join) =>
      join
        .onRef("subFE.id", "=", "subIE.formationEtablissementId")
        .on("subIE.rentreeScolaire", "=", "2022")
    )
    .innerJoin("etablissement as subEtab", "subEtab.UAI", "subFE.UAI")
    .whereRef("subFE.cfd", "=", cfdRef)
    .whereRef("subFE.dispositifId", "=", codeDispositifRef)
    .whereRef(
      "subEtab.codeRegion",
      "=",
      sql`ANY(array_agg(${eb.ref(codeRegionRef)}))`
    )
    .select([selectTauxPressionAgg("subIE").as("s")])
    .groupBy(["cfd", "dispositifId"]);
};
