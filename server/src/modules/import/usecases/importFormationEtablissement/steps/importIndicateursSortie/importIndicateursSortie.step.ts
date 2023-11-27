import { inject } from "injecti";
import { Insertable } from "kysely";

import { DB } from "../../../../../../db/schema";
import { R } from "../../../../services/inserJeunesApi/formatUaiData";
import { logger } from "../../importLogger";
import { createIndicateurSortie } from "./createIndicateurSortie.dep";
import { getUaiData } from "./getUaiData.dep";

const toIndicateurSorties = ({
  uai,
  ijData,
  formationEtablissementId,
  millesime,
  mefstat,
}: {
  uai: string;
  ijData: R | undefined;
  mefstat: string;
  formationEtablissementId: string;
  millesime: string;
}): Insertable<DB["indicateurSortie"]> | undefined => {
  const type = "depp_mefstat";

  const log = {
    uai,
    millesime,
    mefstat,
  };
  if (!ijData) {
    logger.log({ type, log: { ...log, status: "missing_uai" } });
    return;
  }

  const mefData = ijData.meftstats[mefstat];

  if (!mefData) {
    logger.log({ type, log: { ...log, status: "missing_mefstat" } });
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

  logger.log({ type, log: { ...log, status: "ok" } });
  return indicateurSortie;
};

export const [importIndicateurSortie] = inject(
  { createIndicateurSortie, getUaiData },
  (deps) => {
    return async ({
      uai,
      formationEtablissementId,
      millesime,
      mefstat,
    }: {
      uai: string;
      formationEtablissementId: string;
      millesime: string;
      mefstat: string;
    }) => {
      const ijData = await deps.getUaiData({ millesime, uai });
      const indicateurSortie = toIndicateurSorties({
        ijData,
        millesime,
        mefstat,
        uai,
        formationEtablissementId,
      });
      if (!indicateurSortie) return;
      await deps.createIndicateurSortie(indicateurSortie);
    };
  }
);
