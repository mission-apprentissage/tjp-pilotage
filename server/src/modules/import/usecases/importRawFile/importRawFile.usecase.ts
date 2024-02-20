import { inject } from "injecti";
import { Readable, Writable } from "stream";
import { pipeline } from "stream/promises";

import batchCreate from "../../utils/batchCreate";
import { getStreamParser } from "../../utils/parse";
import { createRawDatas } from "./createRawDatas.dep";
import { deleteRawData } from "./deleteRawData.dep";

export const [importRawFile, importRawFileFactory] = inject(
  {
    batch: batchCreate(createRawDatas, 10000, true),
    deleteRawData,
  },
  (deps) =>
    async ({ fileStream, type }: { fileStream: Readable; type: string }) => {
      process.stdout.write(`Import des lignes du fichier ${type}...\n`);

      await deps.deleteRawData({ type });

      /**
       * TO_REMOVE:
       * L'ancien nom des constats de rentrée c'était : Cab-nbre_division_effectifs_par_etab_mefst11
       * Il faut donc clean la table rawData de toutes les ocurences de ces éléments.
       * C'est nécessaire uniquement lors du passage en prod des imports 2023. Le bout de code devra être retiré ensuite
       */
      if (type.indexOf("constat") > -1) {
        const year = type.replace(/[a-zA-Z]+_/g, "");
        const oldConstatName = "Cab-nbre_division_effectifs_par_etab_mefst11";
        await deps.deleteRawData({ type: `${oldConstatName}_${year}` });
      }

      /**
       * TO_REMOVE:
       * L'ancien nom de BTS_attractivite_capacite c'était : attractivite_capacite_BTS
       * Il faut donc clean la table rawData de toutes les ocurences de ces éléments.
       * C'est nécessaire uniquement lors du passage en prod des imports 2023. Le bout de code devra être retiré ensuite
       */
      if (type.indexOf("BTS_attractivite_capacite") > -1) {
        const year = type.replace(/[a-zA-Z]+_/g, "");
        const oldBtsAttractiviteName = "attractivite_capacite_BTS";
        await deps.deleteRawData({ type: `${oldBtsAttractiviteName}_${year}` });
      }

      let count = 0;
      await pipeline(
        fileStream,
        getStreamParser(),
        new Writable({
          final: async (callback) => {
            await deps.batch.flush();
            console.log(
              `Import du fichier ${type} réussi (${count} lignes ajoutées)\n`
            );
            callback();
          },
          objectMode: true,
          write: async (line, _, callback) => {
            await deps.batch.create({ data: { data: line, type } });
            count++;
            process.stdout.write(`Ajout de ${count} lignes\r`);
            callback();
          },
        })
      );
    }
);
