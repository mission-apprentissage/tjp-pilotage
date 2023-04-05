import { DateTime } from "luxon";

import { Formation } from "../../entities/Formation";
import { DiplomeProfessionnelLine } from "../../files/DiplomesProfessionnels";
import { NFormationDiplomeLine } from "../../files/NFormationDiplome";
import { streamIt } from "../../utils/streamIt";
import { importFormationsDeps } from "./importFormations.deps";
import { overrides } from "./overrides";
import { importFormationHistoriqueFactory } from "./steps/importFormationsHistoriques.step";

const formatCFD = (line: DiplomeProfessionnelLine) => {
  const cfdOverride =
    overrides[
      `${line["Diplôme"]}_${line["Intitulé de la spécialité (et options)"]}`
    ]?.cfd;
  if (cfdOverride) return cfdOverride;

  if (!line["Code diplôme"]) return;
  const cfd = line["Code diplôme"].replace("-", "").slice(0, 8);

  if (isNaN(parseInt(cfd))) return;
  return cfd;
};

const formatRNCP = (line: DiplomeProfessionnelLine) => {
  const rncpOverride =
    overrides[
      `${line["Diplôme"]}_${line["Intitulé de la spécialité (et options)"]}`
    ]?.rncp;
  if (rncpOverride) return rncpOverride;

  if (!line["Code RNCP"]) return;
  if (isNaN(parseInt(line["Code RNCP"]))) return;
  return line["Code RNCP"];
};

type CompleteDiplomePorfessionelLine = DiplomeProfessionnelLine & {
  "Code diplôme": string;
};

const isCompleteDiplomePorfessionelLine = (
  diplomeProfessionnelLine: DiplomeProfessionnelLine
): diplomeProfessionnelLine is CompleteDiplomePorfessionelLine =>
  !!diplomeProfessionnelLine["Code diplôme"];

const formatDiplomeProfessionel = (
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
    importFormationHistorique = importFormationHistoriqueFactory({}),
  } = {}) =>
  async () => {
    console.log(`Import des formations`);
    let count = 0;

    await streamIt(
      (offset) => findDiplomesProfessionnels({ offset, limit: 20 }),
      async (item) => {
        const diplomeProfessionel = formatDiplomeProfessionel(item);
        if (!diplomeProfessionel) return;
        const cfd = diplomeProfessionel["Code diplôme"];

        const nFormationDiplome = await findNFormationDiplome({ cfd });
        if (!nFormationDiplome) return;

        const formation = createFormationFromDiplomeProfessionel({
          nFormationDiplome,
          diplomeProfessionel,
        });
        if (!formation) return;
        count++;
        process.stdout.write(`\r${count}`);
        await createFormation([formation]);
        await importFormationHistorique({ cfd });
      }
    );

    process.stdout.write(`\r${count} formations ajoutées ou mises à jour\n`);
  };

const createFormationFromDiplomeProfessionel = ({
  diplomeProfessionel,
  nFormationDiplome,
}: {
  diplomeProfessionel: CompleteDiplomePorfessionelLine;
  nFormationDiplome: NFormationDiplomeLine;
}): Omit<Formation, "id"> | undefined => {
  return {
    codeFormationDiplome: diplomeProfessionel["Code diplôme"],
    rncp: diplomeProfessionel["Code RNCP"]
      ? parseInt(diplomeProfessionel["Code RNCP"])
      : undefined,
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
