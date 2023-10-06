import { inject } from "injecti";
import _ from "lodash";
import { DateTime } from "luxon";

import { DiplomeProfessionnelLine } from "../../fileTypes/DiplomesProfessionnels";
import { rawDataRepository } from "../../repositories/rawData.repository";
import { streamIt } from "../../utils/streamIt";
import { getCfdDispositifs } from "../getCfdRentrees/getCfdDispositifs.dep";
import { createDataFormation } from "./createDataFormation.dep";
import { findDiplomeProfessionnel } from "./findDiplomeProfessionnel.dep";
import { find2ndeCommune, findSpecialite } from "./findFamilleMetier.dep";
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
  line?: DiplomeProfessionnelLine
): CompleteDiplomePorfessionelLine | undefined => {
  if (!line) return;
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

export const [importDataFormations] = inject(
  {
    findDiplomeProfessionnel,
    findRegroupements,
    createDataFormation,
    getCfdDispositifs,
    find2ndeCommune,
    findSpecialite,
  },
  (deps) => async () => {
    await streamIt(
      (offset) =>
        rawDataRepository.findRawDatas({
          type: "nFormationDiplome_",
          offset,
          limit: 100,
        }),
      async (nFormationDiplome, count) => {
        const cfd = nFormationDiplome.FORMATION_DIPLOME;

        const diplomeProfessionnel = await deps
          .findDiplomeProfessionnel({ cfd })
          .then(formatDiplomeProfessionel);

        const dispositifs = await deps.getCfdDispositifs({ cfd });
        const mefstats = dispositifs.flatMap((dispositif) =>
          dispositif.anneesDispositif.map((item) => item.mefstat)
        );
        const regroupement = await deps.findRegroupements({ mefstats });

        const is2ndeCommune = !!(await deps.find2ndeCommune(cfd));
        const isSpecialite = !!(await deps.findSpecialite(cfd));

        await deps.createDataFormation({
          cfd,
          libelle:
            diplomeProfessionnel?.[
              "Intitulé de la spécialité (et options)"
            ]?.replace(/ \(.*\)/, "") ||
            formatLibelle(nFormationDiplome.LIBELLE_LONG_200),
          rncp: diplomeProfessionnel?.["Code RNCP"]
            ? parseInt(diplomeProfessionnel?.["Code RNCP"]) || undefined
            : undefined,
          cpc: diplomeProfessionnel?.[
            "Commission professionnelle consultative"
          ],
          cpcSecteur: diplomeProfessionnel?.Secteur,
          cpcSousSecteur: diplomeProfessionnel?.["Sous-secteur"],
          libelleFiliere: regroupement,
          codeNiveauDiplome: nFormationDiplome.FORMATION_DIPLOME.slice(0, 3),
          dateOuverture: nFormationDiplome.DATE_OUVERTURE
            ? DateTime.fromFormat(
                nFormationDiplome.DATE_OUVERTURE,
                "dd/LL/yyyy"
              ).toJSDate()
            : undefined,
          dateFermeture: nFormationDiplome.DATE_FERMETURE
            ? DateTime.fromFormat(
                nFormationDiplome.DATE_FERMETURE,
                "dd/LL/yyyy"
              ).toJSDate()
            : undefined,
          typeFamille: is2ndeCommune
            ? "2nde_commune"
            : isSpecialite
            ? "specialite"
            : undefined,
        });

        console.log(`${count}: dataFormation added ${cfd}`);
      }
    );
  }
);

const formatLibelle = (libelle: string) =>
  libelle && _.capitalize(libelle).replace(/ \(.*\)/, "");
