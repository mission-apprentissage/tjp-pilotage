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
    const mefData = await deps.getUaiData({ uai, millesime, voie: "scolaire", mefstat });

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
    const cfdData = await deps.getUaiData({ uai, millesime, voie: "apprentissage", cfd });

    if (!cfdData) {
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
      nbInsertion6mois: cfdData?.nb_en_emploi_6_mois,
      nbInsertion12mois: cfdData.nb_en_emploi_12_mois,
      nbInsertion24mois: cfdData?.nb_en_emploi_24_mois,
      effectifSortie: cfdData?.nb_annee_term,
      nbPoursuiteEtudes: cfdData?.nb_poursuite_etudes,
      nbSortants: cfdData?.nb_sortant,
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
