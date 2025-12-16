/**
 * Importe les indicateurs d'établissement (valeur ajoutée) pour un millésime donné.
 *
 * Fichiers rawData utilisés :
 * - "ij" : données d'insertion Jeunes par UAI et millésime (ensemble, valeur_ajoutee_6_mois)
 *
 * Cette fonction :
 * 1. Récupère les données IJ pour l'UAI et le millésime via rawData type "ij"
 * 2. Extrait la valeur ajoutée 6 mois depuis l'ensemble des données
 * 3. Insère ou met à jour dans la table "indicateurEtablissement"
 *
 * Retourne après insertion des données.
 */

import type { Insertable } from "kysely";

import type { DB } from "@/db/db";
import type { IJUaiData } from "@/modules/import/services/inserJeunesApi/formatUaiData";
import { inject } from "@/utils/inject";

import { getUaiData } from "./getUaiData.dep";
import { upsertIndicateurEtablissement } from "./upsertIndicateurEtablissement.dep";

const toIndicateurEtablissement = ({
  uaiData,
  uai,
  millesime,
}: {
  uaiData?: IJUaiData;
  millesime: string;
  uai: string;
}): Insertable<DB["indicateurEtablissement"]> | undefined => {
  if (!uaiData) return;
  return {
    uai: uai,
    millesime,
    valeurAjoutee: uaiData.ensemble?.valeur_ajoutee_6_mois,
  };
};

export const [importIndicateurEtablissement] = inject(
  {
    getUaiData,
    upsertIndicateurEtablissement,
  },
  (deps) =>
    async ({ uai, millesime }: { uai: string; millesime: string }) => {
      const ijUaiData = await deps.getUaiData({ uai, millesime });
      const indicateur = toIndicateurEtablissement({
        uaiData: ijUaiData,
        millesime,
        uai,
      });
      if (!indicateur) return;
      await deps.upsertIndicateurEtablissement(indicateur);
    }
);
