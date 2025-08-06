import { sql } from "kysely";
import { CURRENT_RENTREE } from "shared";


export const rapprochement = (
  campagneAlias: string,
  demandeAlias: string,
  demandeConstatViewAlias: string,
  dataFormation: string,
  getMotifRapprochement: boolean
) => {
  const campagneTable = sql.table(campagneAlias);
  const demandeTable = sql.table(demandeAlias);
  const constatTable = sql.table(demandeConstatViewAlias);
  const formationTable = sql.table(dataFormation);

  const isDemandeValidee = sql`${demandeTable}."statut" = 'demande validée'`;
  const isCampagneTerminee = sql`${campagneTable}."statut" = 'terminée'`;

  const rentreePlusTard = sql`(${demandeTable}."rentreeScolaire")::int > ${CURRENT_RENTREE}::int`;

  const codeNiveaux = sql`(${sql.join(
    ['500', '400', '320', '461', '561', '241', '450', '401', '420', '010'].map((v) => sql`${v}`),
    sql`, `
  )})`;
  const isNiveauInList = sql`${formationTable}."codeNiveauDiplome" IN ${codeNiveaux}`;

  const placesTransformeesScolaire = sql`ABS(${constatTable}."differenceCapaciteScolaire") + ABS(${constatTable}."differenceCapaciteScolaireColoree")`;
  const placesTransformeesApprentissage = sql`ABS(${constatTable}."differenceCapaciteApprentissage") + ABS(${constatTable}."differenceCapaciteApprentissageColoree")`;

  const aucuneDonneeApres = sql`(
    ${constatTable}."effectifEntreeApres" IS NULL AND
    ${constatTable}."capaciteEntreeApres" IS NULL AND
    ${constatTable}."voeuEntreeApres" IS NULL
  )`;

  const apprentissageOnly = sql`
    (${placesTransformeesScolaire}) <= 1 AND (${placesTransformeesApprentissage}) > 1
  `;

  const apprentissageAvecDataScolaire = sql`(NOT ${aucuneDonneeApres} AND ${apprentissageOnly})`;
  const apprentissageSansDataScolaire = sql`(${aucuneDonneeApres} AND ${apprentissageOnly})`;

  const isColoration = sql`${demandeTable}."typeDemande" = 'coloration'`;

  const colorationAvecDataScolaire = sql`${isColoration} AND NOT (${aucuneDonneeApres})`;
  const colorationSansDataScolaire = sql`${isColoration} AND (${aucuneDonneeApres})`;

  const isFermeture = sql`${demandeTable}."typeDemande" = 'fermeture'`;
  const aucunEleveApres = sql`${constatTable}."effectifEntreeApres" IS NULL`;
  const fermetureSansElevesApres = sql`${isFermeture} AND ${aucunEleveApres}`;
  const fermetureAvecElevesApres = sql`${isFermeture} AND NOT (${aucunEleveApres})`;



  return getMotifRapprochement ? sql<string>`
    CASE
      WHEN NOT ${isDemandeValidee} THEN ${getRapprochementMotif('statut')}
      WHEN NOT ${isCampagneTerminee} THEN ${getRapprochementMotif('campagne')}
      WHEN ${rentreePlusTard} THEN  ${getRapprochementMotif('rentrée')}
      WHEN NOT ${isNiveauInList} THEN ${getRapprochementMotif('niveau')}
      WHEN ${apprentissageAvecDataScolaire} THEN ${getRapprochementMotif('apprentissageOK')}
      WHEN ${apprentissageSansDataScolaire} THEN ${getRapprochementMotif('apprentissage')}
      WHEN ${colorationAvecDataScolaire} THEN ${getRapprochementMotif('colorationOK')}
      WHEN ${colorationSansDataScolaire} THEN ${getRapprochementMotif('horsFermetureKO')}
      WHEN ${fermetureAvecElevesApres} THEN ${getRapprochementMotif('fermeture')}
      WHEN ${fermetureSansElevesApres} THEN ${getRapprochementMotif('fermetureOK')}
      WHEN ${aucuneDonneeApres} THEN ${getRapprochementMotif('horsFermetureKO')}
      WHEN NOT ${aucuneDonneeApres} THEN ${getRapprochementMotif('horsFermetureOK')}
      ELSE '??'
    END
  `: sql<string>`
    CASE
      WHEN NOT ${isDemandeValidee} THEN '-'
      WHEN NOT ${isCampagneTerminee} THEN '-'
      WHEN ${rentreePlusTard} THEN '-'
      WHEN NOT ${isNiveauInList} THEN '-'
      WHEN ${apprentissageAvecDataScolaire} THEN 'OK'
      WHEN ${apprentissageSansDataScolaire} THEN '-'
      WHEN ${colorationAvecDataScolaire} THEN 'OK'
      WHEN ${colorationSansDataScolaire} THEN 'KO'
      WHEN ${fermetureAvecElevesApres} THEN '-'
      WHEN ${fermetureSansElevesApres} THEN 'OK'
      WHEN ${aucuneDonneeApres} THEN 'KO'
      WHEN NOT ${aucuneDonneeApres} THEN 'OK'
      ELSE '??'
    END
  
  `;

};

export const getRapprochementMotif = (
  key: "statut" | "campagne" | "rentrée" | "niveau" |
       "apprentissageOK" | "apprentissage" | "colorationOK" |
       "fermeture" | "fermetureOK" | "horsFermetureKO" | "horsFermetureOK"
): string => {

  const motifRapprochementList = {
    "statut": "Cette demande n’est pas validée. Nous n’avons pas fait le rapprochement avec le constat de rentrée",
    "campagne": "Cette demande est issue d'une campagne en cours. Nous n’avons pas fait le rapprochement avec le constat de rentrée",
    "rentrée": "Cette demande concerne une rentrée scolaire future (données non disponibles)",
    "niveau": "Ce type de diplôme n’est pas présent dans le constat de rentrée",
    "apprentissageOK": "Cette demande concerne des effectifs en apprentissage. La formation est bien présente dans le constat de rentrée en voie scolaire, mais nous ne pouvons pas vérifier les effectifs en apprentissage",
    "apprentissage": "Cette demande concerne des effectifs en apprentissage ; cette formation n’existe pas dans le constat de rentrée en voie scolaire",
    "colorationOK": "Cette demande concerne une coloration de places. La formation est bien présente dans le constat de rentrée mais nous ne pouvons pas vérifier les places colorées réellement occupées",
    "fermeture": "Cette demande concerne une fermeture mais nous avons trouvé des effectifs en entrée",
    "fermetureOK": "Cette demande concerne une fermeture. Nous n’avons pas trouvé d’effectifs en entrée",
    "horsFermetureKO": "Cette demande n’a pas pu être rapprochée du constat de rentrée, veuillez vérifier l'UAI et/ou le CFD et apporter les corrections nécessaires pour que le rapprochement s’opère",
    "horsFermetureOK": "La formation de cet établissement est bien présente dans le constat de rentrée"
  };

  return motifRapprochementList[key];
};
