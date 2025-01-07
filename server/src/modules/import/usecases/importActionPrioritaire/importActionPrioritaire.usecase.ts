import { dataDI } from "@/modules/import/data.di";
import { streamIt } from "@/modules/import/utils/streamIt";

import { importActionPrioritaireDeps } from "./importActionPrioritaire.deps";

export const importActionPrioritaireFactory =
  ({
    findRawDatas = dataDI.rawDataRepository.findRawDatas,
    createActionsPrioritaires = importActionPrioritaireDeps.createActionsPrioritaires,
    deleteActionPrioritaire = importActionPrioritaireDeps.deleteActionPrioritaire,
  }) =>
    async () => {
      console.log(`Suppression des actions prioritaires...`);
      await deleteActionPrioritaire();

      console.log(`Import des actions prioritaires\n`);
      let countActionsPrioritaires = 0;
      await streamIt(
        async (countActionsPrioritaires) =>
          findRawDatas({
            type: "actions_prioritaires",
            offset: countActionsPrioritaires,
            limit: 20,
          }),
        async (item) => {
          const data = {
            cfd: item.cfd,
            codeRegion: item.codeRegion,
            codeDispositif: item.codeDispositif,
          };

          countActionsPrioritaires++;
          process.stdout.write(`\r${countActionsPrioritaires}`);
          await createActionsPrioritaires(data);
        },
        { parallel: 20 }
      );

      process.stdout.write(`\r${countActionsPrioritaires} actions prioritaires ajoutées ou mises à jour\n\n`);
    };

export const importActionPrioritaire = importActionPrioritaireFactory({});
