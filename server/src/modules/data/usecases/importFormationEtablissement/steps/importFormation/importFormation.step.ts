import { inject } from "injecti";
import { Insertable } from "kysely";
import _ from "lodash";
import { DateTime } from "luxon";

import { DB } from "../../../../../../db/schema";
import { DiplomeProfessionnelLine } from "../../../../../../../public/files/DiplomesProfessionnels";
import { NFormationDiplomeLine } from "../../../../../../../public/files/NFormationDiplome";
import { getCfdDispositifs } from "../../../getCfdRentrees/getCfdRentrees.usecase";
import { importFormationHistorique } from "../importFormationsHistoriques/importFormationsHistoriques.step";
import { createFormation } from "./createFormation.dep";
import { findNFormationDiplome } from "./findNFormationDiplome.dep";
import { findRegroupements } from "./findRegroupements.dep";
import { overrides } from "./overrides";

const getLineOverride = (line: DiplomeProfessionnelLine) => {
  return overrides[
    `${line["Diplôme"]}_${line["Intitulé de la spécialité (et options)"]}`
  ];
};

const formatCFD = (line: DiplomeProfessionnelLine) => {
  if (!line["Code diplôme"]) return;
  const cfd = line["Code diplôme"].replace("-", "").slice(0, 8);

  if (isNaN(parseInt(cfd))) return;
  return cfd;
};

const formatRNCP = (line: DiplomeProfessionnelLine) => {
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

  const overridedLine = {
    ...formattedLine,
    ..._.pickBy(
      getLineOverride(line),
      (val) => _.isString(val) && val.trim() !== ""
    ),
  };
  if (!isCompleteDiplomePorfessionelLine(overridedLine)) return;
  return overridedLine;
};

export const [importFormation] = inject(
  {
    findNFormationDiplome,
    createFormation,
    importFormationHistorique,
    getCfdDispositifs,
    findRegroupements,
  },
  (deps) =>
    async ({
      diplomeProfessionnelLine,
    }: {
      diplomeProfessionnelLine: DiplomeProfessionnelLine;
    }) => {
      const diplomeProfessionel = formatDiplomeProfessionel(
        diplomeProfessionnelLine
      );
      const cfd = diplomeProfessionel?.["Code diplôme"];
      if (!cfd) return;

      const nFormationDiplome = await deps.findNFormationDiplome({ cfd });
      if (!nFormationDiplome) return;

      const dispositifs = await deps.getCfdDispositifs({ cfd });
      const mefstats = dispositifs.flatMap((dispositif) =>
        dispositif.anneesDispositif.map((item) => item.mefstat)
      );
      const regroupement = await deps.findRegroupements({ mefstats });

      const formation = createFormationFromDiplomeProfessionel({
        nFormationDiplome,
        diplomeProfessionel,
        regroupement,
      });
      if (!formation) return;

      await deps.createFormation(formation);
      await deps.importFormationHistorique({ cfd });
      return formation;
    }
);

const createFormationFromDiplomeProfessionel = ({
  diplomeProfessionel,
  nFormationDiplome,
  regroupement,
}: {
  diplomeProfessionel: CompleteDiplomePorfessionelLine;
  nFormationDiplome: NFormationDiplomeLine;
  regroupement?: string;
}): Insertable<DB["formation"]> | undefined => {
  return {
    codeFormationDiplome: diplomeProfessionel["Code diplôme"],
    rncp: diplomeProfessionel["Code RNCP"]
      ? parseInt(diplomeProfessionel["Code RNCP"])
      : null,
    libelleDiplome: diplomeProfessionel[
      "Intitulé de la spécialité (et options)"
    ].replace(/"/g, ""),
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
      : null,
    libelleFiliere: regroupement,
    CPC:
      diplomeProfessionel["Commission professionnelle consultative"]
        ?.replace("CPC", "")
        .trim() || null,
    CPCSecteur:
      diplomeProfessionel["Secteur"]?.replace("Secteur", "").trim() || null,
    CPCSousSecteur:
      diplomeProfessionel["Sous-secteur"]?.replace("Sous-secteur", "").trim() ||
      null,
  };
};
