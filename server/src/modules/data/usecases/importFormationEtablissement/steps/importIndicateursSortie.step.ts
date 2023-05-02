import { IndicateurSortie } from "../../../entities/IndicateurSortie";
import { R } from "../../../services/inserJeunesApi/formatUaiData";
import { CfdRentrees } from "../../getCfdRentrees/getCfdRentrees.usecase";
import { dependencies } from "../dependencies.di";
import { logger } from "../importLogger";

const toIndicateurSorties = ({
  ijData,
  dispositifRentrees,
  formationEtablissementId,
  millesime,
}: {
  ijData: R | undefined;
  dispositifRentrees: CfdRentrees;
  formationEtablissementId: string;
  millesime: string;
}): IndicateurSortie | undefined => {
  const mefstatLastYear =
    dispositifRentrees.annees[dispositifRentrees.annees.length - 1].mefstat;
  const type = "depp_mefstat";

  const log = {
    uai: dispositifRentrees.uai,
    millesime,
    mefstat: mefstatLastYear,
  };
  if (!ijData) {
    logger.log({ type, log: { ...log, status: "missing_uai" } });
    return;
  }

  const mefData = ijData.meftstats?.[mefstatLastYear];

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
    millesime,
    dispositifRentrees,
  }: {
    formationEtablissementId: string;
    millesime: string;
    dispositifRentrees: CfdRentrees;
  }) => {
    const ijData = await getUaiData({ millesime, uai: dispositifRentrees.uai });
    const indicateurSortie = toIndicateurSorties({
      ijData,
      millesime,
      dispositifRentrees,
      formationEtablissementId,
    });
    if (!indicateurSortie) return;
    await createIndicateurSortie([indicateurSortie]);
  };
};
