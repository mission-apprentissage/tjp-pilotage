/**
 * [LA TABLE "formation" N'EST PLUS UTILE, CETTE FONCTIONNALITÉ EST CONSERVÉE POUR HISTORIQUE]
 * Importe une formation au sein d'un établissement en créant une entrée formation.
 *
 * Données existantes en base consultées :
 * - Table "dataFormation" : récupère CFD, libellés, RNCP, codes NSF, niveaux et secteurs professionnels
 *
 * Cette fonction :
 * 1. Recherche les données de formation depuis la table dataFormation via CFD
 * 2. Vérifie que la date d'ouverture est présente
 * 3. Insère ou met à jour dans la table "formation" avec tous les champs (CFD, RNCP, libellés, secteurs, NSF)
 *
 * Retourne l'objet formation créé/mis à jour.
 */

import { inject } from "@/utils/inject";

import { createFormation } from "./createFormation.dep";
import { findDataFormation } from "./findDataFormation.dep";

export const [importFormation] = inject(
  {
    createFormation,
    findDataFormation,
  },
  (deps) =>
    async ({ cfd }: { cfd: string }) => {
      const dataFormation = await deps.findDataFormation(cfd);
      if (!dataFormation) return;

      if (!dataFormation.dateOuverture) return;
      const formation = {
        codeFormationDiplome: dataFormation.cfd,
        rncp: dataFormation.rncp,
        libelleFormation: dataFormation.libelleFormation ?? "",
        codeNiveauDiplome: dataFormation.codeNiveauDiplome,
        dateOuverture: dataFormation.dateOuverture,
        dateFermeture: dataFormation.dateFermeture,
        libelleFiliere: dataFormation.libelleNsf,
        CPC: dataFormation.cpc,
        cpcSecteur: dataFormation.cpcSecteur,
        cpcSousSecteur: dataFormation.cpcSousSecteur,
      };
      await deps.createFormation(formation);
      return formation;
    }
);
