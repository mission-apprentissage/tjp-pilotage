import { IndicateurSortie } from "../../../entities/IndicateurSortie";
import { R } from "../../../services/inserJeunesApi/formatUaiData";
import { AnneeDispositif } from "../../getCfdRentrees/getCfdRentrees.usecase";
import { dependencies } from "../dependencies.di";
import { logger } from "../importLogger";

const toIndicateurSorties = ({
  uai,
  ijData,
  formationEtablissementId,
  millesime,
  anneesDispositif,
}: {
  uai: string;
  ijData: R | undefined;
  anneesDispositif: AnneeDispositif[];
  formationEtablissementId: string;
  millesime: string;
}): IndicateurSortie | undefined => {
  const mefstatLastYear = anneesDispositif[anneesDispositif.length - 1].mefstat;
  const type = "depp_mefstat";

  const log = {
    uai,
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
    uai,
    formationEtablissementId,
    millesime,
    anneesDispositif,
  }: {
    uai: string;
    formationEtablissementId: string;
    millesime: string;
    anneesDispositif: AnneeDispositif[];
  }) => {
    const ijData = await getUaiData({ millesime, uai });
    const indicateurSortie = toIndicateurSorties({
      ijData,
      millesime,
      anneesDispositif,
      uai,
      formationEtablissementId,
    });
    if (!indicateurSortie) return;
    await createIndicateurSortie([indicateurSortie]);
  };
};
