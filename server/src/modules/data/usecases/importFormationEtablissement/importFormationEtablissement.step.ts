import { dataDI } from "../../data.di";
import { IndicateurEntree } from "../../entities/IndicateurEntree";
import { IndicateurSortie } from "../../entities/IndicateurSortie";
import { Cab_bre_division_effectifs_par_etab_mefst11 } from "../../files/Cab-nbre_division_effectifs_par_etab_mefst11";
import { dependencies } from "./dependencies.di";
import { Logs } from "./types/Logs";

type DeppEtablissement = Awaited<
  ReturnType<typeof dataDI.inserJeunesApi.getUaiData>
>;

export const importFormationEtablissementFactory = ({
  createFormationEtablissement = dependencies.createFormationEtablissement,
  createIndicateurSortie = dependencies.createIndicateurSortie,
  createIndicateurEntree = dependencies.createIndicateurEntree,
  findRawData = dataDI.rawDataRepository.findRawData,
} = {}) => {
  return async ({
    deppMillesimeDatas,
    uai,
    cfd,
    mefstat11LastYear,
    mefstat11FirstYear,
    dispositifId,
    voie,
  }: {
    deppMillesimeDatas: { data: DeppEtablissement; millesime: string }[];
    uai: string;
    cfd: string;
    mefstat11LastYear: string;
    mefstat11FirstYear: string;
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

    const cab_nbre_division_effectifs_par_etab_mefst11 = await findRawData({
      type: "Cab-nbre_division_effectifs_par_etab_mefst11",
      filter: {
        "Mef Bcp 11": mefstat11FirstYear,
        "Numéro d'établissement": uai,
      },
    });
    const { logs: logEntree, indicateurEntrees } = await importIndicateurEntree(
      {
        mefstat11FirstYear,
        formationEtablissementId: formationEtablissement.id,
        uai,
        cab_nbre_division_effectifs_par_etab_mefst11,
      }
    );
    await createIndicateurEntree(indicateurEntrees);

    const { logs: logSortie, indicateurSorties } =
      await importIndicateurSorties({
        deppMillesimeDatas,
        mefstat11LastYear,
        uai,
        formationEtablissementId: formationEtablissement.id,
      });
    await createIndicateurSortie(indicateurSorties);

    return [...logEntree, ...logSortie];
  };
};

const importIndicateurSorties = async ({
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
        effectifSortie: mefData?.nb_annee_term,
        nbPoursuiteEtudes: mefData?.nb_poursuite_etudes,
        nbSortants: mefData?.nb_sortant,
        millesimeSortie: millesime,
      };
    })
    .filter((item): item is Exclude<typeof item, undefined> => !!item);

  return { indicateurSorties, logs };
};

const importIndicateurEntree = async ({
  mefstat11FirstYear,
  formationEtablissementId,
  uai,
  cab_nbre_division_effectifs_par_etab_mefst11,
}: {
  mefstat11FirstYear: string;
  formationEtablissementId: string;
  uai: string;
  cab_nbre_division_effectifs_par_etab_mefst11: Cab_bre_division_effectifs_par_etab_mefst11;
}) => {
  const type = "effectifEntree";
  const logs: Logs = [];

  const indicateurEntree: IndicateurEntree = {
    formationEtablissementId,
    millesimeEntree: "2022",
    effectifEntree:
      parseInt(
        cab_nbre_division_effectifs_par_etab_mefst11?.["Nombre d'élèves"]
      ) || undefined,
  };

  const status =
    indicateurEntree.effectifEntree !== undefined ? "ok" : "missing";
  logs.push({ type, log: { uai, mefstat11FirstYear, status } });
  if (!indicateurEntree) return { logs: [], indicateurEntrees: [] };
  return { logs, indicateurEntrees: [indicateurEntree] };
};
