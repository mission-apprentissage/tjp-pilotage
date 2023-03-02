import fs from "fs";

import { inserJeunesApi } from "../../services/inserJeunesApi/inserJeunes.api";
import { streamIt } from "../../utils/streamIt";
import { dependencies } from "./dependencies.di";
import { importEtablissementFactory } from "./importEtablissement.service";
import { importFormationEtablissementFactory } from "./importFormationEtablissement.service";
import { Logs } from "./types/Logs";
import { getLastMefstat11 } from "./utils/getLastMefstat11";

const MILLESIMES = ["2018_2019", "2019_2020", "2020_2021"];

export const importFormationEtablissementsFactory = ({
  findFormations = dependencies.findFormations,
  findAffelnet2ndes = dependencies.findAffelnet2ndes,
  findNMefs = dependencies.findNMefs,
  getUaiData = inserJeunesApi.getUaiData,
  importFormationEtablissement = importFormationEtablissementFactory(),
  importEtablissement = importEtablissementFactory(),
}) => {
  const logs: Logs = [];
  const insertLog = (newLogs: Logs) => {
    newLogs.forEach((log) =>
      console.log(`log ${log.type} ${JSON.stringify(log.log, undefined, "")}`)
    );
    logs.push(...newLogs);
  };

  const uaiFormationsMap: Record<
    string,
    {
      cfd: string;
      mefstat11LastYear: string;
      mefstat11FirstYear: string;
      dispositifId: string;
      voie: "scolaire" | "apprentissage";
    }[]
  > = {};

  return async () => {
    await streamIt(
      async (count) => findFormations({ offset: count, limit: 50 }),
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
            const voie =
              affelnet2nde.Statut === "ST" ? "scolaire" : "apprentissage";
            if (voie !== "scolaire") continue;
            const uaiFormation = {
              cfd: item.codeFormationDiplome,
              mefstat11LastYear: nMefLast.MEF_STAT_11,
              mefstat11FirstYear: nMefAnnee1.MEF_STAT_11,
              dispositifId: nMefAnnee1.DISPOSITIF_FORMATION,
              voie,
            } as const;
            uaiFormationsMap[affelnet2nde.Etablissement] = [
              ...(uaiFormationsMap[affelnet2nde.Etablissement] ?? []),
              uaiFormation,
            ];
          }
        }
      }
    );

    let count = 1;
    const uaiFormationEntries = Object.entries(uaiFormationsMap);
    for (const [uai, formationsData] of uaiFormationEntries) {
      if (!formationsData.length) continue;
      console.log("uai", uai, `${count} of ${uaiFormationEntries.length}`);
      count++;

      const deppMillesimeDatas = await Promise.all(
        MILLESIMES.map(async (millesime) => ({
          millesime,
          data: await getUaiData({ uai, millesime }),
        }))
      );

      await importEtablissement({
        uai,
        deppMillesimeDatas,
      });

      for (const formationData of formationsData) {
        const newLogs = await importFormationEtablissement({
          uai,
          ...formationData,
          deppMillesimeDatas,
        });
        insertLog(newLogs);
      }
    }

    fs.writeFileSync("logs/uais", JSON.stringify(logs, undefined, " "));
  };
};

export const importFormationEtablissements =
  importFormationEtablissementsFactory({});
