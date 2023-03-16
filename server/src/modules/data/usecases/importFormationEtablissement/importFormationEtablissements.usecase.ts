import fs from "fs";

import { inserJeunesApi } from "../../services/inserJeunesApi/inserJeunes.api";
import { streamIt } from "../../utils/streamIt";
import { dependencies } from "./dependencies.di";
import { getUaiFormationsFactory } from "./getUaiFormations.step";
import { importEtablissementFactory } from "./importEtablissement.step";
import { importFormationEtablissementFactory } from "./importFormationEtablissement.step";
import { Logs } from "./types/Logs";

const MILLESIMES = ["2018_2019", "2019_2020", "2020_2021"];

export const importFormationEtablissementsFactory = ({
  findFormations = dependencies.findFormations,
  getUaiData = inserJeunesApi.getUaiData,
  importFormationEtablissement = importFormationEtablissementFactory(),
  importEtablissement = importEtablissementFactory(),
  getUaiFormations = getUaiFormationsFactory({}),
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
      uai: string;
    }[]
  > = {};

  return async () => {
    await streamIt(
      async (count) => findFormations({ offset: count, limit: 50 }),
      async (item) => {
        const uaiFormations = await getUaiFormations({
          cfd: item.codeFormationDiplome,
        });
        uaiFormations.forEach((uaiFormation) => {
          uaiFormationsMap[uaiFormation.uai] = [
            ...(uaiFormationsMap[uaiFormation.uai] ?? []),
            uaiFormation,
          ];
        });
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

      await importEtablissement({ uai, deppMillesimeDatas });

      for (const formationData of formationsData) {
        const newLogs = await importFormationEtablissement({
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
