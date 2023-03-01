import { DateTime } from "luxon";

import { dataDI } from "../../data.di";
import { DiplomeProfessionnelLine } from "../../files/DiplomesProfessionnels";
import { streamIt } from "../../utils/streamIt";
import { importFormationsDeps } from "./importFormations.deps";
import { CFDOverride, RNCPOverride } from "./overrides";

const formatCFD = (line: DiplomeProfessionnelLine) => {
  const cfdOverride =
    CFDOverride[
      `${line["Diplôme"]}_${line["Intitulé de la spécialité (et options)"]}`
    ];
  if (cfdOverride) return cfdOverride;

  if (!line["Code diplôme"]) return;
  const cfd = line["Code diplôme"].replace("-", "").slice(0, 8);

  if (isNaN(parseInt(cfd))) return;
  return cfd;
};

const formatRNCP = (line: DiplomeProfessionnelLine) => {
  const rncpOverride =
    RNCPOverride[
      `${line["Diplôme"]}_${line["Intitulé de la spécialité (et options)"]}`
    ];
  if (rncpOverride) return rncpOverride;

  if (!line["Code RNCP"]) return;
  if (isNaN(parseInt(line["Code RNCP"]))) return;
  return line["Code RNCP"];
};

const cfds: string[] = [];

export const importFormationsFactory =
  () =>
  async ({
    createFormation = importFormationsDeps.createFormation,
    findRawDatas = dataDI.rawDataRepository.findRawDatas,
    findRawData = dataDI.rawDataRepository.findRawData,
  } = {}) => {
    console.log(`Import des formations`);

    let count = 0;
    await streamIt(
      (count) =>
        findRawDatas({
          type: "diplomesProfessionnels",
          offset: count,
          limit: 20,
        }),
      async (item) => {
        const diplomeProfessionel = {
          ...item,
          "Code diplôme": formatCFD(item),
          "Code RNCP": formatRNCP(item),
        };
        if (
          !diplomeProfessionel["Code diplôme"] ||
          !diplomeProfessionel["Code RNCP"]
        )
          return;

        const nFormationDiplome = await findRawData({
          type: "nFormationDiplome_",
          filter: { FORMATION_DIPLOME: diplomeProfessionel["Code diplôme"] },
        });
        if (!nFormationDiplome) return;

        count++;
        process.stdout.write(`\r${count}`);

        cfds.push(diplomeProfessionel["Code diplôme"]);

        const formation = {
          codeFormationDiplome: diplomeProfessionel["Code diplôme"],
          rncp: parseInt(diplomeProfessionel["Code RNCP"]),
          libelleDiplome:
            diplomeProfessionel["Intitulé de la spécialité (et options)"],
          codeNiveauDiplome: diplomeProfessionel["Code diplôme"].slice(0, 3),
          dateOuverture: DateTime.fromFormat(
            nFormationDiplome.DATE_OUVERTURE,
            "dd/LL/yyyy"
          ).toJSDate(),
          dateFermeture: nFormationDiplome.DATE_FERMETURE
            ? DateTime.fromFormat(
                nFormationDiplome.DATE_FERMETURE,
                "dd/LL/yyyy"
              ).toJSDate()
            : undefined,
        };

        await createFormation([formation]);

        // createFormationHistorique
        // createFormationEtablissement
        // createEtablissement
      }
    );

    process.stdout.write(`\r${count} formations ajoutées ou mises à jour\n`);
  };

export const importFormations = importFormationsFactory();
