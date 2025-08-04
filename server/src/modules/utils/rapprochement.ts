import { sql } from "kysely";
import { CURRENT_RENTREE } from "shared";


export const rapprochement = (
  campagneAlias: string,
  demandeAlias: string,
  demandeConstatViewAlias: string,
  dataFormation: string,
  getRaison: boolean
) => {
  const campagneTable = sql.table(campagneAlias);
  const demandeTable = sql.table(demandeAlias);
  const constatTable = sql.table(demandeConstatViewAlias);
  const formationTable = sql.table(dataFormation);

  const etatDemandeOK = sql`${demandeTable}."statut" = 'demande validée' AND ${campagneTable}."statut" = 'terminée'`;

  const codeNiveaux = sql`(${sql.join(
    ['500', '400', '320', '461', '561', '241', '450', '401', '420', '010'].map((v) => sql`${v}`),
    sql`, `
  )})`;
  const isNiveauInList = sql`${formationTable}."codeNiveauDiplome" IN ${codeNiveaux}`;

  const placesTransformeesScolaire = sql`ABS(${constatTable}."differenceCapaciteScolaire") + ABS(${constatTable}."differenceCapaciteScolaireColoree")`;
  const placesTransformeesApprentissage = sql`ABS(${constatTable}."differenceCapaciteApprentissage") + ABS(${constatTable}."differenceCapaciteApprentissageColoree")`;
  const apprentissageOnly = sql`
    (${placesTransformeesScolaire}) <= 1 AND (${placesTransformeesApprentissage}) > 1
  `;

  const isColoration = sql`${demandeTable}."typeDemande" = 'coloration'`;

  const aucuneDonneeApres = sql`
    ${constatTable}."effectifEntreeApres" IS NULL AND
    ${constatTable}."capaciteEntreeApres" IS NULL AND
    ${constatTable}."voeuEntreeApres" IS NULL
  `;

  const isFermeture = sql`${demandeTable}."typeDemande" = 'fermeture'`;
  const aucunEleveApres = sql`${constatTable}."effectifEntreeApres" IS NULL`;
  const rentreePlusTard = sql`${CURRENT_RENTREE}::int < (${demandeTable}."rentreeScolaire")::int `;

  return getRaison ? sql<string>`
    CASE
      WHEN NOT (${etatDemandeOK}) THEN 'statut'
      WHEN ${apprentissageOnly} THEN 'apprentissage'
      WHEN ${isColoration} THEN 'coloration'
      WHEN NOT ${isNiveauInList} THEN 'niveau'
      WHEN NOT ${isFermeture} AND ${aucuneDonneeApres} AND ${rentreePlusTard} THEN 'rentrée future'
      ELSE '-'
    END
  `: sql<string>`
    CASE
      WHEN NOT (${etatDemandeOK}) THEN '-'
      WHEN ${apprentissageOnly} THEN '-'
      WHEN ${isColoration} THEN '-'
      WHEN NOT ${isNiveauInList} THEN '-'
      WHEN ${isFermeture} THEN
        CASE
          WHEN ${aucunEleveApres} THEN 'OK'
          ELSE 'KO'
        END

      WHEN ${aucuneDonneeApres} THEN
        CASE 
          WHEN ${rentreePlusTard} THEN '-'
          ELSE 'KO'
        END
      ELSE 'OK'
    END
  `;

};
