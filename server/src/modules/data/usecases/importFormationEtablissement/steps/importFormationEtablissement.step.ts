import { dataDI } from "../../../data.di";
import { IndicateurSortie } from "../../../entities/IndicateurSortie";
import { dependencies } from "../dependencies.di";
import { Logs } from "../types/Logs";
import { importIndicateurEntreeFactory } from "./importIndicateursEntree.step";

type DeppEtablissement = Awaited<
  ReturnType<typeof dataDI.inserJeunesApi.getUaiData>
>;

export const importFormationEtablissementFactory = ({
  createFormationEtablissement = dependencies.createFormationEtablissement,
  createIndicateurSortie = dependencies.createIndicateurSortie,
  importIndicateurEntree = importIndicateurEntreeFactory(),
} = {}) => {
  return async ({
    deppMillesimeDatas,
    uai,
    cfd,
    mefstat11LastYear,
    mefstat11FirstYear,
    libelleDebut,
    isSpecialite,
    dispositifId,
    voie,
  }: {
    deppMillesimeDatas: { data: DeppEtablissement; millesime: string }[];
    uai: string;
    cfd: string;
    mefstat11LastYear: string;
    mefstat11FirstYear: string;
    libelleDebut: string;
    isSpecialite: boolean;
    dispositifId: string;
    voie: "scolaire" | "apprentissage";
  }): Promise<Logs> => {
    if (voie !== "scolaire") return [];
    const formationEtablissement = await createFormationEtablissement({
      UAI: uai,
      cfd,
      dispositifId,
      voie,
    });

    const logEntree = await importIndicateurEntree({
      isSpecialite,
      formationEtablissementId: formationEtablissement.id,
      mefstat11FirstYear,
      libelleDebut,
      uai,
    });

    const { logs: logSortie, indicateurSorties } = toIndicateurSorties({
      deppMillesimeDatas,
      mefstat11LastYear,
      uai,
      formationEtablissementId: formationEtablissement.id,
    });
    await createIndicateurSortie(indicateurSorties);

    return [...logEntree, ...logSortie];
  };
};

const toIndicateurSorties = ({
  deppMillesimeDatas,
  mefstat11LastYear,
  uai,
  formationEtablissementId,
}: {
  deppMillesimeDatas: { data: DeppEtablissement; millesime: string }[];
  mefstat11LastYear: string;
  uai: string;
  formationEtablissementId: string;
}) => {
  const type = "depp_mefstat";
  const logs: Logs = [];

  const indicateurSorties: IndicateurSortie[] = deppMillesimeDatas
    .map(({ data, millesime }) => {
      const log = { uai, millesime, mefstat: mefstat11LastYear };
      if (!data) {
        logs.push({ type, log: { ...log, status: "missing_uai" } });
        return;
      }

      const mefData = data.meftstats?.[mefstat11LastYear];
      if (!mefData) {
        logs.push({ type, log: { ...log, status: "missing_mefstat" } });
        return;
      }

      logs.push({ type, log: { ...log, status: "ok" } });

      return {
        formationEtablissementId,
        nbInsertion6mois: mefData?.nb_en_emploi_6_mois,
        nbInsertion12mois: mefData.nb_en_emploi_12_mois,
        nbInsertion24mois: mefData?.nb_en_emploi_24_mois,
        effectifSortie: mefData?.nb_annee_term,
        nbPoursuiteEtudes: mefData?.nb_poursuite_etudes,
        nbSortants: mefData?.nb_sortant,
        millesimeSortie: millesime,
      };
    })
    .filter((item): item is Exclude<typeof item, undefined> => !!item);

  return { indicateurSorties, logs };
};
