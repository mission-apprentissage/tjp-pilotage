import { ExpressionBuilder, RawBuilder, sql } from "kysely";

import { DB } from "../../../../db/schema";

const capaciteAnnee = (
  annee: RawBuilder<unknown>,
  indicateurEntreeAlias: string
) => {
  return sql`NULLIF((jsonb_extract_path(${sql.table(
    indicateurEntreeAlias
  )}."capacites",${annee})), 'null')::INT`;
};

const premierVoeuxAnnee = (
  annee: RawBuilder<unknown>,
  indicateurEntreeAlias: string
) => {
  return sql`NULLIF((jsonb_extract_path(${sql.table(
    indicateurEntreeAlias
  )}."premiersVoeux",${annee})), 'null')::INT`;
};

export const selectDenominateurPressionAgg = (
  indicateurEntreeAlias: string
) => sql<number>`
  SUM(
    case when
    ${premierVoeuxAnnee(
      sql`${sql.table(indicateurEntreeAlias)}."anneeDebut"::text`,
      indicateurEntreeAlias
    )} is not null
    then ${capaciteAnnee(
      sql`${sql.table(indicateurEntreeAlias)}."anneeDebut"::text`,
      indicateurEntreeAlias
    )}
    end
  )`;

export const selectTauxPressionAgg = (
  indicateurEntreeAlias: string
) => sql<number>`
    case when
    ${selectDenominateurPressionAgg(indicateurEntreeAlias)} >= 0
    then round(100 * SUM(${premierVoeuxAnnee(
      sql`${sql.table(indicateurEntreeAlias)}."anneeDebut"::text`,
      indicateurEntreeAlias
    )})
    / ${selectDenominateurPressionAgg(indicateurEntreeAlias)})
    end
  `;

export const selectDenominateurPression = (
  indicateurEntreeAlias: string
) => sql<number>`
    case when
    ${capaciteAnnee(
      sql`${sql.table(indicateurEntreeAlias)}."anneeDebut"::text`,
      indicateurEntreeAlias
    )} is not null
    then ${capaciteAnnee(
      sql`${sql.table(indicateurEntreeAlias)}."anneeDebut"::text`,
      indicateurEntreeAlias
    )}
    end`;

export const selectTauxPression = (
  indicateurEntreeAlias: string
) => sql<number>`
    case when
    ${selectDenominateurPression(indicateurEntreeAlias)} >= 0
    then (100 * ${premierVoeuxAnnee(
      sql`${sql.table(indicateurEntreeAlias)}."anneeDebut"::text`,
      indicateurEntreeAlias
    )}
    / ${selectDenominateurPression(indicateurEntreeAlias)})
    end
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
  rentreeScolaire = "2022",
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

type EbRef<EB extends ExpressionBuilder<DB, never>> = Parameters<EB["ref"]>[0];

export const withTauxPressionReg = <EB extends ExpressionBuilder<DB, never>>({
  eb,
  cfdRef,
  dispositifIdRef,
  codeRegionRef,
}: {
  eb: EB;
  codeRegion?: string | "ref";
  cfdRef: EbRef<EB>;
  dispositifIdRef: EbRef<EB>;
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
    .whereRef("subFE.dispositifId", "=", dispositifIdRef)
    .whereRef(
      "subEtab.codeRegion",
      "=",
      sql`ANY(array_agg(${eb.ref(codeRegionRef)}))`
    )
    .select([selectTauxPressionAgg("subIE").as("s")])
    .groupBy(["cfd", "dispositifId"]);
};
