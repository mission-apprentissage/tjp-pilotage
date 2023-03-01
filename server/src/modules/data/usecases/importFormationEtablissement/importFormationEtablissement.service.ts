import { dataDI } from "../../data.di";
import { IndicateurSortie } from "../../entities/FormationEtablissement";
import { dependencies } from "./dependencies.di";

type DeppEtablissement = Awaited<
  ReturnType<typeof dataDI.inserJeunesApi.getUaiData>
>;

export const importFormationEtablissementFactory =
  ({
    createFormationEtablissement = dependencies.createFormationEtablissement,
    createIndicateurSortie = dependencies.createIndicateurSortie,
  } = {}) =>
  async ({
    deppMillesimeDatas,
    uai,
    cfd,
    mefstat11LastYear,
    dispositifId,
    voie,
  }: {
    deppMillesimeDatas: { data: DeppEtablissement; millesime: string }[];
    uai: string;
    cfd: string;
    mefstat11LastYear: string;
    dispositifId: string;
    voie: "scolaire" | "apprentissage";
  }) => {
    if (voie !== "scolaire") return [];
    const formationEtablissement = await createFormationEtablissement({
      UAI: uai,
      cfd,
      dispositifId,
      voie,
    });

    const mefstatLogs: {
      uai: string;
      mefstat: string;
      millesime: string;
      status: "missing_uai" | "ok" | "missing_mefstat";
    }[] = [];

    const indicateurSorties: IndicateurSortie[] = deppMillesimeDatas
      .map(({ data, millesime }) => {
        if (!data) {
          mefstatLogs.push({
            uai,
            millesime,
            status: "missing_uai",
            mefstat: mefstat11LastYear,
          });
          console.log(`uai ${uai}: no depp result`);
          return;
        }

        const mefData = data.meftstats?.[mefstat11LastYear];
        if (!mefData) {
          mefstatLogs.push({
            uai,
            millesime,
            status: "missing_mefstat",
            mefstat: mefstat11LastYear,
          });
          console.log(
            `uai ${uai} mefstat ${mefstat11LastYear} : no mefstat result from depp`
          );
          return;
        }

        mefstatLogs.push({
          uai,
          millesime,
          status: "ok",
          mefstat: mefstat11LastYear,
        });
        console.log(`uai ${uai} mefstat ${mefstat11LastYear} : ok`);
        return {
          formationEtablissementId: formationEtablissement.id,
          nbInsertion6mois: mefData?.nb_en_emploi_6_mois,
          effectifSortie: mefData?.nb_annee_term,
          nbPoursuiteEtudes: mefData?.nb_poursuite_etudes,
          nbSortants: mefData?.nb_sortant,
          millesimeSortie: millesime,
        };
      })
      .filter((item): item is Exclude<typeof item, undefined> => !!item);

    console.log(
      `------ ${indicateurSorties.length} lignes indicateurSortie ajoutées`
    );
    await createIndicateurSortie(indicateurSorties);

    return mefstatLogs;
  };
