/**
 * Importe les indicateurs de sortie (insertion post-formation) pour une formation et établissement.
 *
 * Fichiers rawData utilisés :
 * - "ij" : données d'insertion Jeunes par UAI et millésime (scolaire/apprentissage, effectifs, insertion 6/12/24 mois)
 *
 * Données externes consultées :
 * - API CONTINUUM : alternative si données IJ non disponibles
 *
 * Cette fonction :
 * 1. Récupère les données IJ pour l'UAI et le millésime depuis rawData type "ij"
 * 2. Filtre les données pour le MEFSTAT spécifique dans la voie scolaire
 * 3. Si pas de données MEF, utilise CONTINUUM API alternative
 * 4. Extrait effectifs de sortie, insertion 6/12/24 mois, poursuite d'études
 * 5. Insère ou met à jour dans la table "indicateurSortie"
 *
 * Retourne après insertion des données.
 */

import { omit } from "lodash-es";

import { inject } from "@/utils/inject";

import { createIndicateurSortie } from "./createIndicateurSortie.dep";
import { findAnciennesFormation } from "./findAnciennesFormation.dep";
import { findIndicateurSortie } from "./findIndicateurSortie.dep";
import { findNouvellesFormation } from "./findNouvellesFormation.dep";
import { getUaiData } from "./getUaiData.dep";

export const [importIndicateurSortie] = inject({ createIndicateurSortie, getUaiData }, (deps) => {
  return async ({
    uai,
    formationEtablissementId,
    millesime,
    mefstat,
    cfd,
    codeDispositif,
  }: {
    uai: string;
    formationEtablissementId: string;
    millesime: string;
    mefstat: string;
    cfd: string;
    codeDispositif: string;
  }) => {
    const ijData = await deps.getUaiData({ millesime, uai });
    const mefData = ijData?.scolaire[mefstat];

    if (!mefData) {
      const continuumData = await getContinuumData({
        cfd,
        codeDispositif,
        uai,
        millesimeSortie: millesime,
        voie: "scolaire",
      });
      if (!continuumData) return;

      await deps.createIndicateurSortie({
        ...omit(continuumData, ["cfd"]),
        formationEtablissementId,
        cfdContinuum: continuumData.cfd,
      });
      return;
    }

    const indicateurSortie = {
      formationEtablissementId,
      nbInsertion6mois: mefData?.nb_en_emploi_6_mois,
      nbInsertion12mois: mefData.nb_en_emploi_12_mois,
      nbInsertion24mois: mefData?.nb_en_emploi_24_mois,
      effectifSortie: mefData?.nb_annee_term,
      nbPoursuiteEtudes: mefData?.nb_poursuite_etudes,
      nbSortants: mefData?.nb_sortant,
      millesimeSortie: millesime,
    };

    await deps.createIndicateurSortie(indicateurSortie);
  };
});

export const [importIndicateurSortieApprentissage] = inject({ createIndicateurSortie, getUaiData }, (deps) => {
  return async ({
    uai,
    formationEtablissementId,
    millesime,
    cfd,
  }: {
    uai: string;
    formationEtablissementId: string;
    millesime: string;
    cfd: string;
  }) => {
    const ijData = await deps.getUaiData({ millesime, uai });
    const mefData = ijData?.apprentissage[cfd];

    if (!mefData) {
      const continuumData = await getContinuumData({
        cfd,
        codeDispositif: null,
        uai,
        millesimeSortie: millesime,
        voie: "apprentissage",
      });
      if (!continuumData) return;

      await deps.createIndicateurSortie({
        ...omit(continuumData, ["cfd"]),
        formationEtablissementId,
        cfdContinuum: continuumData.cfd,
      });
      return;
    }

    const indicateurSortie = {
      formationEtablissementId,
      nbInsertion6mois: mefData?.nb_en_emploi_6_mois,
      nbInsertion12mois: mefData.nb_en_emploi_12_mois,
      nbInsertion24mois: mefData?.nb_en_emploi_24_mois,
      effectifSortie: mefData?.nb_annee_term,
      nbPoursuiteEtudes: mefData?.nb_poursuite_etudes,
      nbSortants: mefData?.nb_sortant,
      millesimeSortie: millesime,
    };

    await deps.createIndicateurSortie(indicateurSortie);
  };
});

const [getContinuumData] = inject(
  {
    findIndicateurSortie,
    findAnciennesFormation,
    findNouvellesFormation,
  },
  (deps) =>
    async ({
      cfd,
      codeDispositif,
      uai,
      millesimeSortie,
      voie,
    }: {
      cfd: string;
      codeDispositif: string | null;
      uai: string;
      millesimeSortie: string;
      voie: string;
    }) => {
      const ancienneFormation = await deps.findAnciennesFormation({
        cfd,
        voie,
      });
      if (ancienneFormation.length !== 1) return;
      const cfdContinuum = ancienneFormation[0].ancienCFD;
      const nouvellesFormation = await deps.findNouvellesFormation({
        cfd: cfdContinuum,
        voie,
      });
      if (nouvellesFormation.length !== 1) return;

      return await deps.findIndicateurSortie({
        cfd: cfdContinuum,
        codeDispositif,
        uai,
        millesimeSortie,
      });
    }
);
