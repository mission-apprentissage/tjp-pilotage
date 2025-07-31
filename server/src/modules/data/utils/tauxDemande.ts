import type { ExpressionBuilder, RawBuilder } from "kysely";
import { sql } from "kysely";
import { CURRENT_RENTREE } from "shared";

import type { DB } from "@/db/db";

const CODE_NIVEAU_DIPLOME_DES_BTS: string = "320";

const capaciteAnnee = (annee: RawBuilder<unknown>, indicateurEntreeAlias: string) => {
  return sql`NULLIF((jsonb_extract_path(${sql.table(indicateurEntreeAlias)}."capacites",${annee})), 'null')::FLOAT`;
};

const voeuxAnnee = (annee: RawBuilder<unknown>, indicateurEntreeAlias: string) => {
  return sql`NULLIF((jsonb_extract_path(${sql.table(indicateurEntreeAlias)}."premiersVoeux",${annee})), 'null')::FLOAT`;
};

export const selectDenominateurDemandeAgg = (
  indicateurEntreeAlias: string,
  codeNiveauDiplomeAlias: string
) => sql<number>`
  SUM(
    CASE
    WHEN ${sql.table(codeNiveauDiplomeAlias)}."codeNiveauDiplome" <> '${sql.raw(CODE_NIVEAU_DIPLOME_DES_BTS)}' THEN NULL
    WHEN ${voeuxAnnee(
    sql`${sql.table(indicateurEntreeAlias)}."anneeDebut"::text`,
    indicateurEntreeAlias
  )} IS NOT NULL
    THEN ${capaciteAnnee(sql`${sql.table(indicateurEntreeAlias)}."anneeDebut"::text`, indicateurEntreeAlias)}
    END
  )`;

export const selectTauxDemandeAgg = (
  indicateurEntreeAlias: string,
  codeNiveauDiplomeAlias: string,
) => sql<number>`
    CASE
    WHEN ${selectDenominateurDemandeAgg(indicateurEntreeAlias, codeNiveauDiplomeAlias)} >= 0
    THEN (
      SUM(${voeuxAnnee(sql`${sql.table(indicateurEntreeAlias)}."anneeDebut"::text`, indicateurEntreeAlias)})
      / ${selectDenominateurDemandeAgg(indicateurEntreeAlias, codeNiveauDiplomeAlias)}
      )::NUMERIC
    END
  `;

export const selectDenominateurDemande = (indicateurEntreeAlias: string) => sql<number>`
    CASE WHEN ${capaciteAnnee(
    sql`${sql.table(indicateurEntreeAlias)}."anneeDebut"::text`,
    indicateurEntreeAlias
  )} IS NOT NULL
    THEN ${capaciteAnnee(sql`${sql.table(indicateurEntreeAlias)}."anneeDebut"::text`, indicateurEntreeAlias)}
    END`;

export const selectTauxDemande = (
  indicateurEntreeAlias: string,
  codeNiveauDiplomeTableAlias: string
) => sql<number>`
    CASE
      WHEN ${sql.table(codeNiveauDiplomeTableAlias)}."codeNiveauDiplome" <> '${sql.raw(CODE_NIVEAU_DIPLOME_DES_BTS)}' THEN NULL
      WHEN ${selectDenominateurDemande(indicateurEntreeAlias)} >= 0
      THEN (
        ${voeuxAnnee(sql`${sql.table(indicateurEntreeAlias)}."anneeDebut"::text`, indicateurEntreeAlias)}
      / ${selectDenominateurDemande(indicateurEntreeAlias)})::NUMERIC
    END
  `;

export const selectTauxDemandeParFormationEtParRegionDemande = ({
  eb,
  rentreeScolaire = CURRENT_RENTREE,
}: {
  eb: ExpressionBuilder<DB, "demande">;
  rentreeScolaire?: string;
}) => {
  return eb
    .selectFrom(tauxDemandeFormationRegional({ eb, rentreeScolaire }).as("demandeDetails"))
    .innerJoin("region", "region.codeRegion", "demandeDetails.codeRegion")
    .innerJoin("formationView", "formationView.cfd", "demandeDetails.cfd")
    .whereRef("region.codeRegion", "=", "demande.codeRegion")
    .whereRef("formationView.cfd", "=", "demande.cfd")
    .select(["demandeDetails.demande as demande"])
    .groupBy(["demandeDetails.cfd", "demandeDetails.codeRegion", "demandeDetails.demande", "region.codeRegion"]);
};

export const tauxDemandeFormationRegional = ({
  eb,
  rentreeScolaire = CURRENT_RENTREE
}: {
  eb: ExpressionBuilder<DB, "demande">;
  rentreeScolaire?: string;
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
      selectTauxDemandeAgg("indicateurEntree", "formationView").as("demande"),
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
