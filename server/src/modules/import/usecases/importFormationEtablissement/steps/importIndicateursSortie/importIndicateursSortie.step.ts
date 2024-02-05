import { inject } from "injecti";
import _ from "lodash";

import { findAnciennesFormation } from "../importIndicateursSortieRegionaux/findAnciennesFormation.dep";
import { findNouvellesFormation } from "../importIndicateursSortieRegionaux/findNouvellesFormation.dep";
import { createIndicateurSortie } from "./createIndicateurSortie.dep";
import { findIndicateurSortie } from "./findIndicateurSortie.dep";
import { getUaiData } from "./getUaiData.dep";

export const [importIndicateurSortie] = inject(
  { createIndicateurSortie, getUaiData },
  (deps) => {
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
      const mefData = ijData?.meftstats[mefstat];

      if (!mefData) {
        const continuumData = await getContinuumData({
          cfd,
          codeDispositif,
          uai,
          millesimeSortie: millesime,
        });
        if (!continuumData) return;

        await deps.createIndicateurSortie({
          ..._.omit(continuumData, ["cfd"]),
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
  }
);

export const [importIndicateurSortieApprentissage] = inject(
  { createIndicateurSortie, getUaiData },
  (deps) => {
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
      const cfdData = ijData?.cfds[cfd];

      if (!cfdData) {
        const continuumData = await getContinuumData({
          cfd,
          codeDispositif: null,
          uai,
          millesimeSortie: millesime,
        });
        if (!continuumData) return;

        await deps.createIndicateurSortie({
          ..._.omit(continuumData, ["cfd"]),
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
  }
);

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
    }: {
      cfd: string;
      codeDispositif: string | null;
      uai: string;
      millesimeSortie: string;
    }) => {
      const ancienneFormation = await deps.findAnciennesFormation({ cfd });
      if (ancienneFormation.length !== 1) return;
      const cfdContinuum = ancienneFormation[0].ancienCFD;
      const nouvellesFormation = await deps.findNouvellesFormation({
        cfd: cfdContinuum,
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
