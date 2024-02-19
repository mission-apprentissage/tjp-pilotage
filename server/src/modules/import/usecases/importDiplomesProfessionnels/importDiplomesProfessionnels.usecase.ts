import { inject } from "injecti";

import { DiplomeProfessionnelLine } from "../../fileTypes/DiplomesProfessionnels";
import { Offres_apprentissage } from "../../fileTypes/Offres_apprentissage";
import { streamIt } from "../../utils/streamIt";
import { createDiplomeProfessionnel } from "./createDiplomeProfessionnel.dep";
import { findDiplomesProfessionnels } from "./findDiplomeProfessionnel.dep";
import { findOffresApprentissages } from "./findOffresApprentissages";
import { refreshFormationMaterializedView } from "./refreshFormationView.dep";

const formatCFDDiplomeProfessionnel = (line: DiplomeProfessionnelLine) => {
  if (!line["Code diplôme"]) return;
  const cfd = line["Code diplôme"].replace("-", "").slice(0, 8);

  if (isNaN(parseInt(cfd))) return;
  return cfd;
};

const formatCFDOffreApprentissage = (line: Offres_apprentissage) => {
  if (
    !line[
      "Code du diplome ou du titre suivant la nomenclature de l'Education nationale (CodeEN)"
    ]
  )
    return;
  const cfd =
    line[
      "Code du diplome ou du titre suivant la nomenclature de l'Education nationale (CodeEN)"
    ];

  if (isNaN(parseInt(cfd))) return;
  return cfd;
};

export const [importDiplomesProfessionnels] = inject(
  {
    findDiplomesProfessionnels,
    findOffresApprentissages,
    createDiplomeProfessionnel,
    refreshFormationMaterializedView,
  },
  (deps) => async () => {
    console.log("Import des diplomeProfessionnel");
    let errorCount = 0;
    await streamIt(
      (count) => deps.findDiplomesProfessionnels({ offset: count, limit: 60 }),
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
        process.stdout.write(
          `\r${count} diplomeProfessionnel (scolaire) ajoutés ou mis à jour`
        );
      },
      { parallel: 20 }
    ).then(() => {
      process.stdout.write(
        `${errorCount > 0 ? `\n(avec ${errorCount} erreurs)` : ""}\n\n`
      );
    });
    console.log("Import des diplomeProfessionnel (apprentissage)");
    errorCount = 0;
    await streamIt(
      (count) => deps.findOffresApprentissages({ offset: count, limit: 60 }),
      async (offreApprentissage, count) => {
        const cfd = formatCFDOffreApprentissage(offreApprentissage);
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
        process.stdout.write(
          `\r${count} diplomeProfessionnel (apprentissage) ajoutés ou mis à jour`
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
