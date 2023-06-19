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
    then (100 * SUM(${premierVoeuxAnnee(
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

export const withTauxPressionReg = ({
  eb,
  codeRegion,
}: {
  eb: ExpressionBuilder<
    DB,
    "formationEtablissement" | "etablissement" | "indicateurEntree"
  >;
  codeRegion?: string | "ref";
}) => {
  return eb
    .selectFrom("formationEtablissement as subFE")
    .innerJoin("indicateurEntree as subIE", (join) =>
      join
        .onRef("subFE.id", "=", "subIE.formationEtablissementId")
        .onRef("subIE.rentreeScolaire", "=", "indicateurEntree.rentreeScolaire")
    )
    .innerJoin("etablissement as subEtab", "subEtab.UAI", "subFE.UAI")
    .whereRef("subFE.cfd", "=", "formationEtablissement.cfd")
    .whereRef("subFE.dispositifId", "=", "formationEtablissement.dispositifId")
    .$call((q) => {
      if (!codeRegion) return q;
      if (codeRegion === "ref") {
        return q.whereRef(
          "subEtab.codeRegion",
          "=",
          "etablissement.codeRegion"
        );
      }
      return q.where("subEtab.codeRegion", "=", codeRegion);
    })
    .select([selectTauxPressionAgg("subIE").as("s")])
    .groupBy(["cfd", "dispositifId"]);
};
