import { ExpressionBuilder, expressionBuilder, RawBuilder, sql } from "kysely";
import { CURRENT_RENTREE } from "shared";

import { DB } from "../../../db/db";

const CODE_NIVEAU_DIPLOME_DES_BTS: string = "320";

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
  indicateurEntreeAlias: string,
  codeNiveauDiplomeAlias: string
) => sql<number>`
  SUM(
    CASE
    WHEN ${sql.table(codeNiveauDiplomeAlias)}."codeNiveauDiplome" = '${sql.raw(
      CODE_NIVEAU_DIPLOME_DES_BTS
    )}' THEN NULL
    WHEN ${premierVoeuxAnnee(
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
  indicateurEntreeAlias: string,
  codeNiveauDiplomeAlias: string
) => sql<number>`
    CASE
    WHEN ${selectDenominateurPressionAgg(
      indicateurEntreeAlias,
      codeNiveauDiplomeAlias
    )} >= 0
    THEN ROUND(
      (
        SUM(${premierVoeuxAnnee(
          sql`${sql.table(indicateurEntreeAlias)}."anneeDebut"::text`,
          indicateurEntreeAlias
        )})
      / ${selectDenominateurPressionAgg(
        indicateurEntreeAlias,
        codeNiveauDiplomeAlias
      )}
      )::NUMERIC, 2)
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
  indicateurEntreeAlias: string,
  codeNiveauDiplomeTableAlias: string
) => sql<number>`
    CASE
      WHEN ${sql.table(
        codeNiveauDiplomeTableAlias
      )}."codeNiveauDiplome" = '${sql.raw(
        CODE_NIVEAU_DIPLOME_DES_BTS
      )}' THEN NULL
      WHEN ${selectDenominateurPression(indicateurEntreeAlias)} >= 0
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
  rentreeScolaire = CURRENT_RENTREE,
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
      "demande.codeDispositif"
    )
    .whereRef("region.codeRegion", "=", "demande.codeRegion")
    .where("indicateurEntree.rentreeScolaire", "=", rentreeScolaire)
    .select([
      selectTauxPressionAgg("indicateurEntree", "formationView").as("pression"),
      "region.codeRegion",
      "formationView.cfd",
    ])
    .groupBy([
      "formationView.cfd",
      "formationView.codeNiveauDiplome",
      "formationEtablissement.dispositifId",
      "region.codeRegion",
    ]);
};

export const withTauxPressionReg = <
  EB extends ExpressionBuilder<DB, "demande" | "dataEtablissement">,
>({
  cfdRef,
  codeDispositifRef,
  codeRegionRef,
}: {
  eb: EB;
  codeRegion?: string | "ref";
  cfdRef: Parameters<EB["ref"]>[0];
  codeDispositifRef: Parameters<EB["ref"]>[0];
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
    .innerJoin("dataFormation as subF", "subF.cfd", "subFE.cfd")
    .whereRef("subFE.cfd", "=", cfdRef)
    .whereRef("subFE.dispositifId", "=", codeDispositifRef)
    .whereRef(
      "subEtab.codeRegion",
      "=",
      sql`ANY(array_agg(${eb.ref(codeRegionRef)}))`
    )
    .select([selectTauxPressionAgg("subIE", "subF").as("s")])
    .groupBy(["subFE.cfd", "dispositifId"]);
};
