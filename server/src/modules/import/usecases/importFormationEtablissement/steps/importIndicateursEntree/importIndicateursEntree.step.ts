/**
 * Importe les indicateurs d'entrée (capacités et premiers voeux) pour une formation dans un établissement.
 *
 * Fichiers rawData utilisés (via appels aux steps) :
 * - "BTS_attractivite_capacite" : pour formations BTS (via getIndicateursParcoursSup)
 * - "attractivite_capacite" : pour formations hors-BTS (via getIndicateursAffelnet)
 *
 * Données existantes en base consultées :
 * - Table "familleMetier" : recherche si le CFD est année commune (cfdFamille) ou spécialité (cfd)
 *
 * Cette fonction :
 * 1. Détermine si c'est une spécialité ou année commune (affecte anneeDebut)
 * 2. Pour apprentissage : crée entrée vide (aucun indicateur)
 * 3. Pour scolaire BTS : récupère capacités/voeux via Parcoursup (rawData "BTS_attractivite_capacite")
 * 4. Pour scolaire hors-BTS : récupère capacités/voeux via Affelnet (rawData "attractivite_capacite")
 * 5. Insère ou met à jour dans la table "indicateurEntree"
 *
 * Retourne après insertion des données.
 */

import type { VoieType } from "shared";

import type {
  AnneeDispositif,
  AnneeEnseignement,
} from "@/modules/import/usecases/getCfdRentrees/getCfdRentrees.usecase";
import { getIndicateursAffelnet } from "@/modules/import/usecases/importFormationEtablissement/steps/getIndicateurAffelnet/getIndicateurAffelnet.step";
import { getIndicateursParcoursSup } from "@/modules/import/usecases/importFormationEtablissement/steps/getIndicateursParcoursSup/getIndicateursParcoursSup.step";
import { inject } from "@/utils/inject";

import { createIndicateurEntree } from "./createIndicateurEntree.dep";
import { findAnneeCommune, findSpecialite } from "./findFamilleMetier";
import { findHistorique } from "./findHistorique";

const isBTS = (cfd: string) => cfd.substring(0, 3) === "320";

export const [importIndicateurEntree, importIndicateurEntreeFactory] = inject(
  {
    createIndicateurEntree,
    getIndicateursAffelnet,
    getIndicateursParcoursSup,
    findAnneeCommune,
    findSpecialite,
    findHistorique,
  },
  (deps) => {
    return async ({
      formationEtablissementId,
      anneesEnseignement,
      anneesDispositif,
      cfd,
      rentreeScolaire,
      uai,
      voie
    }: {
      formationEtablissementId: string;
      anneesEnseignement: AnneeEnseignement[];
      anneesDispositif: Record<string, AnneeDispositif>;
      cfd: string;
      rentreeScolaire: string;
      uai: string;
      voie: VoieType
    }) => {
      const isSpecialite = await deps.findSpecialite({
        cfd,
      });
      const isAnneeCommune = await deps.findAnneeCommune({
        cfdFamille: cfd,
      });

      const anneeDebut = isSpecialite && !isAnneeCommune ? 1 : 0;

      if (voie === "apprentissage") {
        await deps.createIndicateurEntree({
          anneeDebut,
          effectifs: [],
          capacites: [],
          premiersVoeux: [],
          formationEtablissementId,
          rentreeScolaire
        });
      } else {
        const { capacites, premiersVoeux } = isBTS(cfd)
          ? await deps.getIndicateursParcoursSup({
            anneesDispositif,
            uai,
            anneeDebut,
            rentreeScolaire,
          })
          : await deps.getIndicateursAffelnet({
            anneesDispositif,
            uai,
            anneeDebut,
            rentreeScolaire,
          });

        const indicateurEntree = toIndicateurEntree({
          anneesEnseignement,
          formationEtablissementId,
          capacites,
          anneeDebut,
          premiersVoeux,
          rentreeScolaire,
        });

        if (!indicateurEntree) return;
        await deps.createIndicateurEntree(indicateurEntree);
      }
    };
  }
);

const toIndicateurEntree = ({
  anneesEnseignement,
  formationEtablissementId,
  capacites,
  anneeDebut,
  premiersVoeux,
  rentreeScolaire,
}: {
  anneesEnseignement: AnneeEnseignement[];
  formationEtablissementId: string;
  capacites?: (number | null)[];
  anneeDebut: number;
  premiersVoeux: (number | null)[];
  rentreeScolaire: string;
}) => {
  const indicateurEntree = {
    formationEtablissementId,
    rentreeScolaire,
    anneeDebut: anneeDebut,
    effectifs: anneesEnseignement.map((annee) => annee.effectif ?? null),
    capacites: anneesEnseignement.map((_, i) => capacites?.[i] ?? null),
    premiersVoeux,
  };

  if (!indicateurEntree) return;
  return indicateurEntree;
};
