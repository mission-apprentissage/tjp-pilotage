import fs from "fs";

import { dataDI } from "../../data.DI";
import { FormationEtablissement } from "../../entities/FormationEtablissement";
import { inserJeunesApi } from "../../services/inserJeunesApi/inserJeunes.api";
import { streamIt } from "../../utils/streamIt";
import { dependencies } from "./dependencies.di";
import { formatToEtablissement } from "./formatToEtablissement";
import { getLastMefstat11 } from "./getLastMefstat11";

const logs = {
  uais: [] as {
    status: "missing_uai" | "ok";
    millesime: string;
    uai: string;
  }[],
  mefstats: [] as {
    uai: string;
    mefstat: string;
    millesime: string;
    status: "missing_uai" | "ok" | "missing_mefstat";
  }[],
};
export const importFormationEtablissementFactory = ({
  findFormations = dependencies.findFormations,
  findAffelnet2ndes = dependencies.findAffelnet2ndes,
  findNMefs = dependencies.findNMefs,
  getDeppEtablissement = getDeppEtablissementFactory(),
  importFormationEtablissements = importFormationEtablissementsFactory(),
  importEtablissement = importEtablissementFactory(),
}) => {
  const uaiFormationsMap: Record<
    string,
    { cfd: string; mefstat11LastYear: string; dispositifId: string }[]
  > = {};

  return async () => {
    await streamIt(
      async (count) => findFormations({ offset: count, limit: 30 }),
      async (item) => {
        const nMefs = await findNMefs({ cfd: item.codeFormationDiplome });
        const nMefsAnnee1 = nMefs.filter(
          (item) => parseInt(item.ANNEE_DISPOSITIF) === 1
        );

        for (const nMefAnnee1 of nMefsAnnee1) {
          const affelnet2ndes = await findAffelnet2ndes({
            mefStat11: nMefAnnee1.MEF_STAT_11,
          });

          const nMefLast = getLastMefstat11({
            nMefs,
            nMefAnnee1,
          });

          if (!nMefLast) continue;

          for (const affelnet2nde of affelnet2ndes) {
            uaiFormationsMap[affelnet2nde.Etablissement] = [
              ...(uaiFormationsMap[affelnet2nde.Etablissement] ?? []),
              {
                cfd: item.codeFormationDiplome,
                mefstat11LastYear: nMefLast.MEF_STAT_11,
                dispositifId: nMefAnnee1.DISPOSITIF_FORMATION,
              },
            ];
          }
        }
      }
    );

    let count = 1;
    for (const uaiFormations of Object.entries(uaiFormationsMap)) {
      const [uai, formationsData] = uaiFormations;
      console.log(
        "uai",
        uai,
        `${count} of ${Object.entries(uaiFormationsMap).length}`
      );
      count++;

      const deppMillesimeDatas = await Promise.all(
        ["2018_2019", "2019_2020", "2020_2021"].map(async (millesime) => {
          const data = await getDeppEtablissement({ uai, millesime });
          return { millesime, data };
        })
      );
      await importEtablissement({ uai, deppMillesimeDatas });

      for (const formationData of formationsData) {
        const { cfd, mefstat11LastYear, dispositifId } = formationData;
        await importFormationEtablissements({
          deppMillesimeDatas,
          cfd,
          mefstat11LastYear,
          dispositifId,
          uai,
        });
      }
    }

    fs.writeFileSync("uais", JSON.stringify(logs, undefined, " "));
  };
};

type DeppEtablissement = Awaited<
  ReturnType<typeof dataDI.inserJeunesApi.getUaiData>
>;

export const importFormationEtablissementsFactory =
  ({
    createFormationEtablissement = dependencies.createFormationEtablissement,
  } = {}) =>
  async ({
    deppMillesimeDatas,
    uai,
    cfd,
    mefstat11LastYear,
    dispositifId,
  }: {
    deppMillesimeDatas: { data: DeppEtablissement; millesime: string }[];
    uai: string;
    cfd: string;
    mefstat11LastYear: string;
    dispositifId: string;
  }) => {
    const formationEtablissements: FormationEtablissement[] = deppMillesimeDatas
      .map(({ data, millesime }) => {
        if (!data) {
          logs.mefstats.push({
            uai,
            millesime: millesime,
            status: "missing_uai",
            mefstat: mefstat11LastYear,
          });
          console.log(`uai ${uai}: no depp result`);
          return;
        }

        const mefData = data.meftstats?.[mefstat11LastYear];
        if (!mefData) {
          logs.mefstats.push({
            uai,
            millesime: millesime,
            status: "missing_mefstat",
            mefstat: mefstat11LastYear,
          });
          console.log(
            `uai ${uai} mefstat ${mefstat11LastYear} : no mefstat result from depp`
          );
          return;
        }

        logs.mefstats.push({
          uai,
          millesime: millesime,
          status: "ok",
          mefstat: mefstat11LastYear,
        });
        console.log(`uai ${uai} mefstat ${mefstat11LastYear} : ok`);
        return {
          cfd,
          UAI: uai,
          dispositifId,
          nbInsertion6mois: mefData?.nb_en_emploi_6_mois,
          effectifSortie: mefData?.nb_annee_term,
          nbPoursuiteEtudes: mefData?.nb_poursuite_etudes,
          nbSortants: mefData?.nb_sortant,
          millesimeIJ: millesime,
          millesimeEntree: "2021",
        };
      })
      .filter((item): item is Exclude<typeof item, undefined> => !!item);

    console.log(`------ ${formationEtablissements.length} added`);

    for (const formationEtablissement of formationEtablissements) {
      await createFormationEtablissement(formationEtablissement);
    }
  };

export const importEtablissementFactory =
  ({
    createEtablissement = dependencies.createEtablissement,
    findLyceeACCE = dependencies.findLyceeACCE,
    upsertIndicateurEtablissement = dependencies.upsertIndicateurEtablissement,
  } = {}) =>
  async ({
    uai,
    deppMillesimeDatas,
  }: {
    uai: string;
    deppMillesimeDatas: { data: DeppEtablissement; millesime: string }[];
  }) => {
    const lyceeACCE = await findLyceeACCE({ uai });
    const etablissement = await createEtablissement(
      formatToEtablissement({ uai, lyceeACCE })
    );

    for (const deppMillesimeData of deppMillesimeDatas) {
      if (!deppMillesimeData.data) {
        logs.uais.push({
          uai,
          millesime: deppMillesimeData.millesime,
          status: "missing_uai",
        });
        return;
      }
      logs.uais.push({
        uai,
        millesime: deppMillesimeData.millesime,
        status: "ok",
      });
      const indicateur = {
        UAI: uai,
        millesime: deppMillesimeData.millesime,
        valeurAjoutee: deppMillesimeData.data.ensemble?.valeur_ajoutee_6_mois,
      };
      await upsertIndicateurEtablissement(indicateur);
    }
    return etablissement;
  };

const ijUaiData: Record<
  string,
  Awaited<ReturnType<typeof inserJeunesApi.getUaiData>> | undefined
> = {};

export const getDeppEtablissementFactory =
  ({ getUaiData = inserJeunesApi.getUaiData } = {}) =>
  async ({ uai, millesime }: { uai: string; millesime: string }) => {
    if (uai in ijUaiData) {
      return ijUaiData[`${uai}_${millesime}`];
    }
    const data = await getUaiData({ uai, millesime });
    ijUaiData[`${uai}_${millesime}`] = data;
    return data;
  };

export const importFormationEtablissement = importFormationEtablissementFactory(
  {}
);
