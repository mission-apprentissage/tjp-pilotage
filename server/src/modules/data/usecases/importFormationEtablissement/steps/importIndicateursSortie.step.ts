import { IndicateurSortie } from "../../../entities/IndicateurSortie";
import { R } from "../../../services/inserJeunesApi/formatUaiData";
import { dependencies } from "../dependencies.di";
import { logger } from "../importLogger";

const toIndicateurSorties = ({
  ijData,
  mefstat11LastYear,
  uai,
  formationEtablissementId,
  millesime,
}: {
  ijData: R | undefined;
  mefstat11LastYear: string;
  uai: string;
  formationEtablissementId: string;
  millesime: string;
}): IndicateurSortie | undefined => {
  const type = "depp_mefstat";

  const log = { uai, millesime, mefstat: mefstat11LastYear };
  if (!ijData) {
    logger.log({ type, log: { ...log, status: "missing_uai" } });
    return;
  }

  const mefData = ijData.meftstats?.[mefstat11LastYear];
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

export const importIndicateurSortieFactory = ({
  createIndicateurSortie = dependencies.createIndicateurSortie,
  getUaiData = dependencies.getUaiData,
} = {}) => {
  return async ({
    formationEtablissementId,
    uai,
    mefstat11LastYear,
    millesime,
  }: {
    formationEtablissementId: string;
    uai: string;
    mefstat11LastYear: string;
    millesime: string;
  }) => {
    const ijData = await getUaiData({ millesime, uai });
    const indicateurSortie = toIndicateurSorties({
      ijData,
      millesime,
      mefstat11LastYear,
      uai,
      formationEtablissementId,
    });
    if (!indicateurSortie) return;
    await createIndicateurSortie([indicateurSortie]);
  };
};
