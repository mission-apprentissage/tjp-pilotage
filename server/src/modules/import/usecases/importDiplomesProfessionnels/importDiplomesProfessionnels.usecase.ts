import { inject } from "injecti";

import { DiplomeProfessionnelLine } from "../../fileTypes/DiplomesProfessionnels";
import { streamIt } from "../../utils/streamIt";
import { findDiplomesProfessionnels } from "../importFormationEtablissement/findDiplomesProfessionnels.dep";
import { createDiplomeProfessionnel } from "./createDiplomeProfessionnel.dep";
import { refreshFormationMaterializedView } from "./refreshFormationView.dep";

const formatCFD = (line: DiplomeProfessionnelLine) => {
  if (!line["Code diplôme"]) return;
  const cfd = line["Code diplôme"].replace("-", "").slice(0, 8);

  if (isNaN(parseInt(cfd))) return;
  return cfd;
};

export const [importDiplomesProfessionnels] = inject(
  {
    findDiplomesProfessionnels,
    createDiplomeProfessionnel,
    refreshFormationMaterializedView,
  },
  (deps) => async () => {
    console.log("Import des diplomeProfessionnel");
    let errorCount = 0;
    await streamIt(
      (count) => deps.findDiplomesProfessionnels({ offset: count, limit: 60 }),
      async (diplomeProfessionnel, count) => {
        const cfd = formatCFD(diplomeProfessionnel);

        if (!cfd) {
          console.log(
            "\n--\nIl manque le CFD pour ce diplome professionnel : ",
            JSON.stringify(diplomeProfessionnel),
            "\n--\n"
          );
          return;
        }

        try {
          await deps.createDiplomeProfessionnel({
            cfd,
          });
        } catch (e) {
          console.log(e);
          errorCount++;
        }
        process.stdout.write(
          `\r${count} diplomeProfessionnel ajoutés ou mis à jour`
        );
      },
      { parallel: 20 }
    ).then(() => {
      process.stdout.write(
        `${errorCount > 0 ? `\n(avec ${errorCount} erreurs)` : ""}\n\n`
      );
    });
  }
);
