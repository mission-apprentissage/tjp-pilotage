import type { DiplomeProfessionnelLine } from "@/modules/import/fileTypes/DiplomesProfessionnels";
import { streamIt } from "@/modules/import/utils/streamIt";
import { inject } from "@/utils/inject";

import { createDiplomeProfessionnel } from "./createDiplomeProfessionnel.dep";
import { findDiplomesProfessionnels } from "./findDiplomeProfessionnel.dep";
import { findOffresApprentissages } from "./findOffresApprentissages";

const formatCFDDiplomeProfessionnel = (line: DiplomeProfessionnelLine) => {
  if (!line["Code diplôme"]) return;
  const cfd = line["Code diplôme"].replace("-", "").slice(0, 8);

  if (isNaN(parseInt(cfd))) return;
  return cfd;
};

export const [importDiplomesProfessionnels] = inject(
  {
    findDiplomesProfessionnels,
    findOffresApprentissages,
    createDiplomeProfessionnel,
  },
  (deps) => async () => {
    console.log("Import des diplomeProfessionnel");
    let errorCount = 0;
    await streamIt(
      async (count) => deps.findDiplomesProfessionnels({ offset: count, limit: 60 }),
      async (diplomeProfessionnel, count) => {
        const cfd = formatCFDDiplomeProfessionnel(diplomeProfessionnel);
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
            voie: "scolaire",
          });
        } catch (e) {
          console.log(e);
          errorCount++;
        }
        process.stdout.write(`\r${count} diplomeProfessionnel (scolaire) ajoutés ou mis à jour`);
      },
      { parallel: 20 }
    ).then(() => {
      process.stdout.write(errorCount > 0 ? `(avec ${errorCount} erreurs)\n\n` : "\n\n");
    });
    console.log("Import des diplomeProfessionnel (apprentissage)");
    errorCount = 0;
    await streamIt(
      async (count) => deps.findOffresApprentissages({ offset: count, limit: 60 }),
      async (cfd, count) => {
        if (!cfd) return;
        try {
          await deps.createDiplomeProfessionnel({
            cfd,
            voie: "apprentissage",
          });
        } catch (e) {
          console.log(e);
          errorCount++;
        }
        process.stdout.write(`\r${count} diplomeProfessionnel (apprentissage) ajoutés ou mis à jour`);
      },
      { parallel: 20 }
    ).then(() => {
      process.stdout.write(errorCount > 0 ? `(avec ${errorCount} erreurs)\n\n` : "\n\n");
    });
  }
);
