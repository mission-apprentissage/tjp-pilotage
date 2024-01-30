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

const isCompleteDiplomeProfessionelLine = (
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
  if (!isCompleteDiplomeProfessionelLine(overridedLine)) return;
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
    console.log("Import des dataFormation");
    let errorCount = 0;
    await streamIt(
      (offset) =>
        rawDataRepository.findRawDatas({
          type: "nFormationDiplome_",
          offset,
          limit: 1000,
        }),
      async (nFormationDiplome, count) => {
        const cfd = nFormationDiplome.FORMATION_DIPLOME;

        const diplomeProfessionnel = await deps
          .findDiplomeProfessionnel({ cfd })
          .then(formatDiplomeProfessionel);

        const dispositifs = await deps.getCfdDispositifs({ cfd });
        const mefstats = dispositifs.flatMap((dispositif) =>
          Object.values(dispositif.anneesDispositif).map((item) => item.mefstat)
        );
        const regroupement = await deps.findRegroupements({ mefstats });

        const isBTS = cfd.slice(0, 3) === "320";
        const is2ndeCommune = !!(await deps.find2ndeCommune(cfd));
        const isSpecialite = !!(await deps.findSpecialite(cfd));

        const getTypeFamille = () => {
          if (is2ndeCommune) return isBTS ? "1ere_commune" : "2nde_commune";
          if (isSpecialite) return isBTS ? "option" : "specialite";
          return undefined;
        };

        try {
          await deps.createDataFormation({
            cfd,
            libelleFormation:
              diplomeProfessionnel?.[
                "Intitulé de la spécialité (et options)"
              ]?.replace(/"/g, "") ||
              formatLibelle(nFormationDiplome.LIBELLE_LONG_200),
            rncp: diplomeProfessionnel?.["Code RNCP"]
              ? parseInt(diplomeProfessionnel?.["Code RNCP"]) || undefined
              : undefined,
            cpc:
              diplomeProfessionnel?.["Commission professionnelle consultative"]
                ?.replace("CPC", "")
                .trim() || "(VIDE)",
            cpcSecteur:
              diplomeProfessionnel?.Secteur?.replace("Secteur", "").trim() ||
              "(VIDE)",
            cpcSousSecteur:
              diplomeProfessionnel?.["Sous-secteur"]
                ?.replace("Sous-secteur", "")
                .trim() || "(VIDE)",
            libelleFiliere: regroupement || "(VIDE)",
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
            typeFamille: getTypeFamille(),
          });
        } catch (e) {
          console.log(e);
          errorCount++;
        }
        process.stdout.write(
          `\r${count} dataFormation (scolaire) ajoutées ou mises à jour`
        );
      },
      { parallel: 20 }
    );
    await streamIt(
      (offset) =>
        rawDataRepository.findRawDatas({
          type: "vFormationDiplome_",
          offset,
          limit: 1000,
        }),
      async (vFormationDiplome, count) => {
        const cfd = vFormationDiplome.FORMATION_DIPLOME;

        const diplomeProfessionnel = await deps
          .findDiplomeProfessionnel({ cfd })
          .then(formatDiplomeProfessionel);

        const dispositifs = await deps.getCfdDispositifs({ cfd });
        const mefstats = dispositifs.flatMap((dispositif) =>
          Object.values(dispositif.anneesDispositif).map((item) => item.mefstat)
        );
        const regroupement = await deps.findRegroupements({ mefstats });

        const isBTS = cfd.slice(0, 3) === "320";
        const is2ndeCommune = !!(await deps.find2ndeCommune(cfd));
        const isSpecialite = !!(await deps.findSpecialite(cfd));

        const getTypeFamille = () => {
          if (is2ndeCommune) return isBTS ? "1ere_commune" : "2nde_commune";
          if (isSpecialite) return isBTS ? "option" : "specialite";
          return undefined;
        };

        try {
          await deps.createDataFormation({
            cfd,
            libelleFormation:
              diplomeProfessionnel?.[
                "Intitulé de la spécialité (et options)"
              ]?.replace(/"/g, "") ||
              formatLibelle(vFormationDiplome.LIBELLE_LONG_200),
            rncp: diplomeProfessionnel?.["Code RNCP"]
              ? parseInt(diplomeProfessionnel?.["Code RNCP"]) || undefined
              : undefined,
            cpc:
              diplomeProfessionnel?.["Commission professionnelle consultative"]
                ?.replace("CPC", "")
                .trim() || "(VIDE)",
            cpcSecteur:
              diplomeProfessionnel?.Secteur?.replace("Secteur", "").trim() ||
              "(VIDE)",
            cpcSousSecteur:
              diplomeProfessionnel?.["Sous-secteur"]
                ?.replace("Sous-secteur", "")
                .trim() || "(VIDE)",
            libelleFiliere: regroupement || "(VIDE)",
            codeNiveauDiplome: vFormationDiplome.FORMATION_DIPLOME.slice(0, 3),
            dateOuverture: vFormationDiplome.DATE_OUVERTURE
              ? DateTime.fromFormat(
                  vFormationDiplome.DATE_OUVERTURE,
                  "dd/LL/yyyy"
                ).toJSDate()
              : undefined,
            dateFermeture: vFormationDiplome.DATE_FERMETURE
              ? DateTime.fromFormat(
                  vFormationDiplome.DATE_FERMETURE,
                  "dd/LL/yyyy"
                ).toJSDate()
              : undefined,
            typeFamille: getTypeFamille(),
          });
        } catch (e) {
          console.log(e);
          errorCount++;
        }
        process.stdout.write(
          `\r${count} dataFormation (apprentissage) ajoutées ou mises à jour`
        );
      },
      { parallel: 20 }
    );
    process.stdout.write(
      `${errorCount > 0 ? `(avec ${errorCount} erreurs)` : ""}\n\n`
    );
  }
);

const formatLibelle = (libelleFormation: string) =>
  libelleFormation && _.capitalize(libelleFormation).replace(/ \(.*\)/, "");

// const importFormationDiplome = inject(
//   {
//     findDiplomeProfessionnel,
//     findRegroupements,
//     createDataFormation,
//     getCfdDispositifs,
//     find2ndeCommune,
//     findSpecialite,
//   },
//   (deps) =>
//     async (
//       line: NFormationDiplomeLine | VFormationDiplomeLine,
//       count: number
//     ) => {
//       const cfd = line.FORMATION_DIPLOME;

//       const diplomeProfessionnel = await deps
//         .findDiplomeProfessionnel({ cfd })
//         .then(formatDiplomeProfessionel);

//       const dispositifs = await deps.getCfdDispositifs({ cfd });
//       const mefstats = dispositifs.flatMap((dispositif) =>
//         Object.values(dispositif.anneesDispositif).map((item) => item.mefstat)
//       );
//       const regroupement = await deps.findRegroupements({ mefstats });

//       const isBTS = cfd.slice(0, 3) === "320";
//       const is2ndeCommune = !!(await deps.find2ndeCommune(cfd));
//       const isSpecialite = !!(await deps.findSpecialite(cfd));

//       const getTypeFamille = () => {
//         if (is2ndeCommune) return isBTS ? "1ere_commune" : "2nde_commune";
//         if (isSpecialite) return isBTS ? "option" : "specialite";
//         return undefined;
//       };

//       await deps.createDataFormation({
//         cfd,
//         libelleFormation:
//           diplomeProfessionnel?.[
//             "Intitulé de la spécialité (et options)"
//           ]?.replace(/"/g, "") || formatLibelle(line.LIBELLE_LONG_200),
//         rncp: diplomeProfessionnel?.["Code RNCP"]
//           ? parseInt(diplomeProfessionnel?.["Code RNCP"]) || undefined
//           : undefined,
//         cpc:
//           diplomeProfessionnel?.["Commission professionnelle consultative"]
//             ?.replace("CPC", "")
//             .trim() || "(VIDE)",
//         cpcSecteur:
//           diplomeProfessionnel?.Secteur?.replace("Secteur", "").trim() ||
//           "(VIDE)",
//         cpcSousSecteur:
//           diplomeProfessionnel?.["Sous-secteur"]
//             ?.replace("Sous-secteur", "")
//             .trim() || "(VIDE)",
//         libelleFiliere: regroupement || "(VIDE)",
//         codeNiveauDiplome: line.FORMATION_DIPLOME.slice(0, 3),
//         dateOuverture: line.DATE_OUVERTURE
//           ? DateTime.fromFormat(line.DATE_OUVERTURE, "dd/LL/yyyy").toJSDate()
//           : undefined,
//         dateFermeture: line.DATE_FERMETURE
//           ? DateTime.fromFormat(line.DATE_FERMETURE, "dd/LL/yyyy").toJSDate()
//           : undefined,
//         typeFamille: getTypeFamille(),
//       });
//     }
// );
