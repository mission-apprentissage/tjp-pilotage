import { sql } from "kysely";

export const rapprochementOK = (
  demandeAlias: string,
  demandeConstatViewAlias: string,
  dataFormation: string
) => {
  const demandeTable = sql.table(demandeAlias);
  const constatTable = sql.table(demandeConstatViewAlias);
  const formationTable = sql.table(dataFormation);

  const codeNiveaux = sql`(${sql.join(
    ['500', '400', '320', '461', '561', '241', '450', '401', '420'].map((v) => sql`${v}`),
    sql`, `
  )})`;

  const isNiveauInList = sql`${formationTable}."codeNiveauDiplome" IN ${codeNiveaux}`;

  // condition commune pour la somme des différences capacite scolaire
  const capaciteScolaireDiffSum = sql`ABS(${constatTable}."differenceCapaciteScolaire") + ABS(${constatTable}."differenceCapaciteScolaireColoree")`;
  // condition commune pour la somme des différences capacite apprentissage
  const capaciteApprentissageDiffSum = sql`ABS(${constatTable}."differenceCapaciteApprentissage") + ABS(${constatTable}."differenceCapaciteApprentissageColoree")`;

  // Sous-condition qui teste si toutes les valeurs avant/apres sont NULL selon typeDemande
  const allNullsAvantApres = sql`${constatTable}."effectifEntreeAvant" IS NULL AND
    ${constatTable}."effectifEntreeApres" IS NULL AND
    ${constatTable}."capaciteEntreeAvant" IS NULL AND
    ${constatTable}."capaciteEntreeApres" IS NULL AND
    ${constatTable}."voeuEntreeAvant" IS NULL AND
    ${constatTable}."voeuEntreeApres" IS NULL`;

  const allNullsApresOnly = sql`${constatTable}."effectifEntreeApres" IS NULL AND
    ${constatTable}."capaciteEntreeApres" IS NULL AND
    ${constatTable}."voeuEntreeApres" IS NULL`;

  return sql<string>`
    CASE
      WHEN ${demandeTable}."typeDemande" <> 'fermeture' THEN
        CASE
          WHEN ${allNullsAvantApres} THEN
            CASE
              WHEN (${capaciteScolaireDiffSum}) <= 1 AND (${capaciteApprentissageDiffSum}) > 1 THEN '-'
              ELSE CASE WHEN ${isNiveauInList} THEN 'KO' ELSE '-' END
            END
          ELSE
            CASE WHEN ${isNiveauInList} THEN 'OK' ELSE '-' END
        END
      ELSE
        CASE
          WHEN ${allNullsApresOnly} THEN
            CASE
              WHEN (${capaciteScolaireDiffSum}) <= 1 AND (${capaciteApprentissageDiffSum}) > 1 THEN '-'
              ELSE CASE WHEN ${isNiveauInList} THEN 'OK' ELSE '-' END
            END
          ELSE
            CASE WHEN ${isNiveauInList} THEN 'KO' ELSE '-' END
        END
    END
  `;
};
