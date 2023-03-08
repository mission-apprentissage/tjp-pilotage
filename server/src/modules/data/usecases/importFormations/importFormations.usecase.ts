import { DateTime } from "luxon";

import { Formation } from "../../entities/Formation";
import { DiplomeProfessionnelLine } from "../../files/DiplomesProfessionnels";
import { NFormationDiplomeLine } from "../../files/NFormationDiplome";
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

type CompleteDiplomePorfessionelLine = DiplomeProfessionnelLine & {
  "Code RNCP": string;
  "Code diplôme": string;
};

const isCompleteDiplomePorfessionelLine = (
  diplomeProfessionnelLine: DiplomeProfessionnelLine
): diplomeProfessionnelLine is CompleteDiplomePorfessionelLine =>
  !!(
    diplomeProfessionnelLine["Code diplôme"] &&
    diplomeProfessionnelLine["Code RNCP"]
  );

const formatDisplomeProfessionel = (
  line: DiplomeProfessionnelLine
): CompleteDiplomePorfessionelLine | undefined => {
  const formattedLine = {
    ...line,
    "Code diplôme": formatCFD(line),
    "Code RNCP": formatRNCP(line),
  };
  if (!isCompleteDiplomePorfessionelLine(formattedLine)) return;
  return formattedLine;
};

export const importFormationsFactory =
  ({
    createFormation = importFormationsDeps.createFormation,
    findDiplomesProfessionnels = importFormationsDeps.findDiplomesProfessionnels,
    findNFormationDiplome = importFormationsDeps.findNFormationDiplome,
  } = {}) =>
  async () => {
    console.log(`Import des formations`);
    let count = 0;

    await streamIt(
      (offset) => findDiplomesProfessionnels({ offset, limit: 20 }),
      async (item) => {
        const diplomeProfessionel = formatDisplomeProfessionel(item);
        if (!diplomeProfessionel) return;

        const nFormationDiplome = await findNFormationDiplome({
          cfd: diplomeProfessionel["Code diplôme"],
        });
        if (!nFormationDiplome) return;

        count++;
        process.stdout.write(`\r${count}`);

        const formation = createFormationFromDiplomePorfessionel({
          nFormationDiplome,
          diplomeProfessionel,
        });
        if (!formation) return;
        await createFormation([formation]);
      }
    );

    process.stdout.write(`\r${count} formations ajoutées ou mises à jour\n`);
  };

const createFormationFromDiplomePorfessionel = ({
  diplomeProfessionel,
  nFormationDiplome,
}: {
  diplomeProfessionel: CompleteDiplomePorfessionelLine;
  nFormationDiplome: NFormationDiplomeLine;
}): Omit<Formation, "id"> | undefined => {
  return {
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
};

export const importFormations = importFormationsFactory({});
