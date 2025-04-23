import type { ExpressionBuilder, RawBuilder } from "kysely";
import { expressionBuilder, sql } from "kysely";
import { CURRENT_RENTREE } from "shared";

import type { DB } from "@/db/db";

const CODE_NIVEAU_DIPLOME_DES_BTS: string = "320";

const capaciteAnnee = (annee: RawBuilder<unknown>, indicateurEntreeAlias: string) => {
  return sql`NULLIF((jsonb_extract_path(${sql.table(indicateurEntreeAlias)}."capacites",${annee})), 'null')::FLOAT`;
};

const premierVoeuxAnnee = (annee: RawBuilder<unknown>, indicateurEntreeAlias: string) => {
  return sql`NULLIF((jsonb_extract_path(${sql.table(indicateurEntreeAlias)}."premiersVoeux",${annee})), 'null')::FLOAT`;
};

export const selectDenominateurPressionAgg = (
  indicateurEntreeAlias: string,
  codeNiveauDiplomeAlias: string,
  withTauxDemande: boolean = false
) => sql<number>`
  SUM(
    CASE
    WHEN ${sql<boolean>`${!withTauxDemande}`} AND
    ${sql.table(codeNiveauDiplomeAlias)}."codeNiveauDiplome" = '${sql.raw(CODE_NIVEAU_DIPLOME_DES_BTS)}' THEN NULL
    WHEN ${premierVoeuxAnnee(
    sql`${sql.table(indicateurEntreeAlias)}."anneeDebut"::text`,
    indicateurEntreeAlias
  )} IS NOT NULL
    THEN ${capaciteAnnee(sql`${sql.table(indicateurEntreeAlias)}."anneeDebut"::text`, indicateurEntreeAlias)}
    END
  )`;

export const selectTauxPressionAgg = (
  indicateurEntreeAlias: string,
  codeNiveauDiplomeAlias: string,
  withTauxDemande: boolean = false
) => sql<number>`
    CASE
    WHEN ${selectDenominateurPressionAgg(indicateurEntreeAlias, codeNiveauDiplomeAlias, withTauxDemande)} >= 0
    THEN (
      SUM(${premierVoeuxAnnee(sql`${sql.table(indicateurEntreeAlias)}."anneeDebut"::text`, indicateurEntreeAlias)})
      / ${selectDenominateurPressionAgg(indicateurEntreeAlias, codeNiveauDiplomeAlias, withTauxDemande)}
      )::NUMERIC
    END
  `;

export const selectDenominateurPression = (indicateurEntreeAlias: string) => sql<number>`
    CASE WHEN ${capaciteAnnee(
    sql`${sql.table(indicateurEntreeAlias)}."anneeDebut"::text`,
    indicateurEntreeAlias
  )} IS NOT NULL
    THEN ${capaciteAnnee(sql`${sql.table(indicateurEntreeAlias)}."anneeDebut"::text`, indicateurEntreeAlias)}
    END`;

export const selectTauxPression = (
  indicateurEntreeAlias: string,
  codeNiveauDiplomeTableAlias: string,
  withTauxDemande: boolean = false
) => sql<number>`
    CASE
      WHEN ${sql<boolean>`${!withTauxDemande}`} AND ${sql.table(
  codeNiveauDiplomeTableAlias
)}."codeNiveauDiplome" = '${sql.raw(CODE_NIVEAU_DIPLOME_DES_BTS)}' THEN NULL
      WHEN ${selectDenominateurPression(indicateurEntreeAlias)} >= 0
      THEN (
        ${premierVoeuxAnnee(sql`${sql.table(indicateurEntreeAlias)}."anneeDebut"::text`, indicateurEntreeAlias)}
      / ${selectDenominateurPression(indicateurEntreeAlias)})::NUMERIC
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
    .selectFrom(tauxPressionFormationRegional({ eb, rentreeScolaire }).as("pressionDetails"))
    .innerJoin("region", "region.codeRegion", "pressionDetails.codeRegion")
    .innerJoin("formationView", "formationView.cfd", "pressionDetails.cfd")
    .whereRef("region.codeRegion", "=", "demande.codeRegion")
    .whereRef("formationView.cfd", "=", "demande.cfd")
    .select(["pressionDetails.pression as pression"])
    .groupBy(["pressionDetails.cfd", "pressionDetails.codeRegion", "pressionDetails.pression", "region.codeRegion"]);
};

export const tauxPressionFormationRegional = ({
  eb,
  rentreeScolaire = CURRENT_RENTREE,
  withTauxDemande = false,
}: {
  eb: ExpressionBuilder<DB, "demande">;
  rentreeScolaire?: string;
  withTauxDemande?: boolean;
}) => {
  return eb
    .selectFrom("formationView")
    .leftJoin("formationEtablissement", (join) =>
      join
        .onRef("formationEtablissement.cfd", "=", "formationView.cfd")
        .onRef("formationEtablissement.voie", "=", "formationView.voie")
    )
    .leftJoin("etablissement", "etablissement.uai", "formationEtablissement.uai")
    .leftJoin("region", "region.codeRegion", "etablissement.codeRegion")
    .innerJoin("indicateurEntree", "indicateurEntree.formationEtablissementId", "formationEtablissement.id")
    .whereRef("formationView.cfd", "=", "demande.cfd")
    .whereRef("formationEtablissement.codeDispositif", "=", "demande.codeDispositif")
    .whereRef("region.codeRegion", "=", "demande.codeRegion")
    .where("indicateurEntree.rentreeScolaire", "=", rentreeScolaire)
    .select([
      selectTauxPressionAgg("indicateurEntree", "formationView", withTauxDemande).as("pression"),
      "region.codeRegion",
      "formationView.cfd",
    ])
    .groupBy([
      "formationView.cfd",
      "formationView.codeNiveauDiplome",
      "formationEtablissement.codeDispositif",
      "region.codeRegion",
    ]);
};

export const withTauxPressionReg = <EB extends ExpressionBuilder<DB, "demande" | "dataEtablissement">>({
  cfdRef,
  codeDispositifRef,
  codeRegionRef,
  indicateurEntreeAlias,
  withTauxDemande = false,
}: {
  eb: EB;
  cfdRef: Parameters<EB["ref"]>[0];
  codeDispositifRef: Parameters<EB["ref"]>[0];
  codeRegionRef: Parameters<EB["ref"]>[0];
  indicateurEntreeAlias?: string;
  withTauxDemande?: boolean;
}) => {
  const eb = expressionBuilder<DB, keyof DB>();
  return eb
    .selectFrom("formationEtablissement as subFE")
    .innerJoin("indicateurEntree as subIE", (join) =>
      join.onRef("subFE.id", "=", "subIE.formationEtablissementId").$call((j) => {
        if (indicateurEntreeAlias)
          return j.onRef(
            "subIE.rentreeScolaire",
            "=",
            sql`${sql.table(indicateurEntreeAlias)}."rentreeScolaire"::text`
          );
        return j.on("subIE.rentreeScolaire", "=", CURRENT_RENTREE);
      })
    )
    .innerJoin("etablissement as subEtab", "subEtab.uai", "subFE.uai")
    .innerJoin("dataFormation as subF", "subF.cfd", "subFE.cfd")
    .whereRef("subFE.cfd", "=", cfdRef)
    .whereRef("subFE.codeDispositif", "=", codeDispositifRef)
    .whereRef("subEtab.codeRegion", "=", sql`ANY(array_agg(${eb.ref(codeRegionRef)}))`)
    .select([selectTauxPressionAgg("subIE", "subF", withTauxDemande).as("s")])
    .groupBy(["subFE.cfd", "subFE.codeDispositif"]);
};

export const withTauxPressionDep = <EB extends ExpressionBuilder<DB, "demande" | "dataEtablissement">>({
  cfdRef,
  codeDispositifRef,
  codeDepartementRef,
  indicateurEntreeAlias,
  withTauxDemande = false,
}: {
  eb: EB;
  cfdRef: Parameters<EB["ref"]>[0];
  codeDispositifRef: Parameters<EB["ref"]>[0];
  codeDepartementRef: Parameters<EB["ref"]>[0];
  indicateurEntreeAlias?: string;
  withTauxDemande?: boolean;
}) => {
  const eb = expressionBuilder<DB, keyof DB>();
  return eb
    .selectFrom("formationEtablissement as subFE")
    .innerJoin("indicateurEntree as subIE", (join) =>
      join.onRef("subFE.id", "=", "subIE.formationEtablissementId").$call((j) => {
        if (indicateurEntreeAlias)
          return j.onRef(
            "subIE.rentreeScolaire",
            "=",
            sql`${sql.table(indicateurEntreeAlias)}."rentreeScolaire"::text`
          );
        return j.on("subIE.rentreeScolaire", "=", CURRENT_RENTREE);
      })
    )
    .innerJoin("etablissement as subEtab", "subEtab.uai", "subFE.uai")
    .innerJoin("dataFormation as subF", "subF.cfd", "subFE.cfd")
    .whereRef("subFE.cfd", "=", cfdRef)
    .whereRef("subFE.codeDispositif", "=", codeDispositifRef)
    .whereRef("subEtab.codeDepartement", "=", sql`ANY(array_agg(${eb.ref(codeDepartementRef)}))`)
    .select([selectTauxPressionAgg("subIE", "subF", withTauxDemande).as("s")])
    .groupBy(["subFE.cfd", "subF.codeNiveauDiplome", "subFE.codeDispositif"]);
};

export const withTauxPressionNat = <EB extends ExpressionBuilder<DB, "demande" | "dataEtablissement">>({
  cfdRef,
  codeDispositifRef,
  indicateurEntreeAlias,
  withTauxDemande = false,
}: {
  eb: EB;
  cfdRef: Parameters<EB["ref"]>[0];
  codeDispositifRef: Parameters<EB["ref"]>[0];
  indicateurEntreeAlias?: string;
  withTauxDemande?: boolean;
}) => {
  const eb = expressionBuilder<DB, keyof DB>();
  return eb
    .selectFrom("formationEtablissement as subFE")
    .innerJoin("indicateurEntree as subIE", (join) =>
      join.onRef("subFE.id", "=", "subIE.formationEtablissementId").$call((j) => {
        if (indicateurEntreeAlias)
          return j.onRef(
            "subIE.rentreeScolaire",
            "=",
            sql`${sql.table(indicateurEntreeAlias)}."rentreeScolaire"::text`
          );
        return j.on("subIE.rentreeScolaire", "=", CURRENT_RENTREE);
      })
    )
    .innerJoin("etablissement as subEtab", "subEtab.uai", "subFE.uai")
    .innerJoin("dataFormation as subF", "subF.cfd", "subFE.cfd")
    .whereRef("subFE.cfd", "=", cfdRef)
    .whereRef("subFE.codeDispositif", "=", codeDispositifRef)
    .select([selectTauxPressionAgg("subIE", "subF", withTauxDemande).as("s")])
    .groupBy(["subFE.cfd", "subF.codeNiveauDiplome", "subFE.codeDispositif"]);
};
