// eslint-disable-next-line import/no-extraneous-dependencies, n/no-extraneous-import
import { inject } from "injecti";
import { capitalize, isString, pickBy } from "lodash-es";
import { DateTime } from "luxon";
import { TypeFamilleEnum } from "shared/enum/typeFamilleEnum";

import type { DiplomeProfessionnelLine } from "@/modules/import/fileTypes/DiplomesProfessionnels";
import { rawDataRepository } from "@/modules/import/repositories/rawData.repository";
import { getCfdDispositifs } from "@/modules/import/usecases/getCfdRentrees/getCfdDispositifs.dep";
import { streamIt } from "@/modules/import/utils/streamIt";

import { createDataFormation } from "./createDataFormation.dep";
import { findDiplomeProfessionnel } from "./findDiplomeProfessionnel.dep";
import { find2ndeCommune, findSpecialite } from "./findFamilleMetier.dep";
import { findRegroupements } from "./findRegroupements.dep";
import { overrides } from "./overrides";

const processedCfds: Set<string> = new Set();

const EMPTY_VALUE = "(VIDE)";

/**
 * Supprimer la regexp de la chaine de caractère,
 * retourner le contenu hors premier mot avec un trim.
 * Rajouter une majuscule pour la première lettre.
 */
const normalizeWithReplace = ({ value, regexp }: { value?: string; regexp: RegExp }) => {
  if (!value) return EMPTY_VALUE;
  return capitalize(value.trim().replace(regexp, "").trim()) ?? EMPTY_VALUE;
};

const getLineOverride = (line: DiplomeProfessionnelLine) => {
  return overrides[`${line["Diplôme"]}_${line["Intitulé de la spécialité (et options)"]}`];
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
): diplomeProfessionnelLine is CompleteDiplomePorfessionelLine => !!diplomeProfessionnelLine["Code diplôme"];

const formatDiplomeProfessionel = (line?: DiplomeProfessionnelLine): CompleteDiplomePorfessionelLine | undefined => {
  if (!line) return;
  const formattedLine = {
    ...line,
    "Code diplôme": formatCFD(line),
    "Code RNCP": formatRNCP(line),
  };

  const overridedLine = {
    ...formattedLine,
    ...pickBy(getLineOverride(line), (val) => isString(val) && val.trim() !== ""),
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
      async (offset) =>
        rawDataRepository.findRawDatas({
          type: "nFormationDiplome_",
          offset,
          limit: 1000,
        }),
      async (nFormationDiplome, count) => {
        const cfd = nFormationDiplome.FORMATION_DIPLOME;
        if (processedCfds.has(cfd)) return;

        const diplomeProfessionnel = await deps.findDiplomeProfessionnel({ cfd }).then(formatDiplomeProfessionel);

        const isBTS = cfd.slice(0, 3) === "320";
        const is2ndeCommune = !!(await deps.find2ndeCommune(cfd));
        const isSpecialite = !!(await deps.findSpecialite(cfd));

        const getTypeFamille = () => {
          if (is2ndeCommune) return isBTS ? TypeFamilleEnum["1ere_commune"] : TypeFamilleEnum["2nde_commune"];
          if (isSpecialite) return isBTS ? TypeFamilleEnum["option"] : TypeFamilleEnum["specialite"];
          return undefined;
        };

        try {
          await deps
            .createDataFormation({
              cfd,
              libelleFormation: diplomeProfessionnel?.["Intitulé de la spécialité (et options)"]
                ? normalizeWithReplace({
                  value: diplomeProfessionnel?.["Intitulé de la spécialité (et options)"],
                  regexp: /"/g,
                })
                : normalizeWithReplace({
                  value: nFormationDiplome.LIBELLE_LONG_200,
                  regexp: / \(.*\)/,
                }),
              rncp: diplomeProfessionnel?.["Code RNCP"]
                ? parseInt(diplomeProfessionnel?.["Code RNCP"]) || undefined
                : undefined,
              cpc: normalizeWithReplace({
                value: diplomeProfessionnel?.["Commission professionnelle consultative"],
                regexp: /^cpc/i,
              }),
              cpcSecteur: normalizeWithReplace({
                value: diplomeProfessionnel?.Secteur,
                regexp: /^secteur/i,
              }),
              cpcSousSecteur: normalizeWithReplace({
                value: diplomeProfessionnel?.["Sous-secteur"],
                regexp: /^sous-secteur/i,
              }),
              codeNsf: cfd.slice(3, 6),
              codeNiveauDiplome: nFormationDiplome.FORMATION_DIPLOME.slice(0, 3),
              dateOuverture: nFormationDiplome.DATE_OUVERTURE
                ? DateTime.fromFormat(nFormationDiplome.DATE_OUVERTURE, "dd/LL/yyyy").toJSDate()
                : undefined,
              dateFermeture: nFormationDiplome.DATE_FERMETURE
                ? DateTime.fromFormat(nFormationDiplome.DATE_FERMETURE, "dd/LL/yyyy").toJSDate()
                : undefined,
              typeFamille: getTypeFamille(),
            })
            .then(() => {
              processedCfds.add(cfd);
            });
        } catch (e) {
          console.log(e);
          errorCount++;
        } finally {
          process.stdout.write(`\r${count} dataFormation (scolaire) ajoutées ou mises à jour`);
        }
      },
      { parallel: 20 }
    ).then(() => {
      console.log();
    });
    await streamIt(
      async (offset) =>
        rawDataRepository.findRawDatas({
          type: "vFormationDiplome_",
          offset,
          limit: 1000,
        }),
      async (vFormationDiplome, count) => {
        const cfd = vFormationDiplome.FORMATION_DIPLOME;
        if (processedCfds.has(cfd)) return;

        const diplomeProfessionnel = await deps.findDiplomeProfessionnel({ cfd }).then(formatDiplomeProfessionel);

        const isBTS = cfd.slice(0, 3) === "320";
        const is2ndeCommune = !!(await deps.find2ndeCommune(cfd));
        const isSpecialite = !!(await deps.findSpecialite(cfd));

        const getTypeFamille = () => {
          if (is2ndeCommune) return isBTS ? TypeFamilleEnum["1ere_commune"] : TypeFamilleEnum["2nde_commune"];
          if (isSpecialite) return isBTS ? TypeFamilleEnum["option"] : TypeFamilleEnum["specialite"];
          return undefined;
        };

        try {
          await deps
            .createDataFormation({
              cfd,
              libelleFormation: diplomeProfessionnel?.["Intitulé de la spécialité (et options)"]
                ? normalizeWithReplace({
                  value: diplomeProfessionnel?.["Intitulé de la spécialité (et options)"],
                  regexp: /"/g,
                })
                : normalizeWithReplace({
                  value: vFormationDiplome.LIBELLE_LONG_200,
                  regexp: / \(.*\)/,
                }),
              rncp: diplomeProfessionnel?.["Code RNCP"]
                ? parseInt(diplomeProfessionnel?.["Code RNCP"]) || undefined
                : undefined,
              cpc: normalizeWithReplace({
                value: diplomeProfessionnel?.["Commission professionnelle consultative"],
                regexp: /^cpc/i,
              }),
              cpcSecteur: normalizeWithReplace({
                value: diplomeProfessionnel?.Secteur,
                regexp: /^secteur/i,
              }),
              cpcSousSecteur: normalizeWithReplace({
                value: diplomeProfessionnel?.["Sous-secteur"],
                regexp: /^sous-secteur/i,
              }),
              codeNsf: cfd.slice(3, 6),
              codeNiveauDiplome: vFormationDiplome.FORMATION_DIPLOME.slice(0, 3),
              dateOuverture: vFormationDiplome.DATE_OUVERTURE
                ? DateTime.fromFormat(vFormationDiplome.DATE_OUVERTURE, "dd/LL/yyyy").toJSDate()
                : undefined,
              dateFermeture: vFormationDiplome.DATE_FERMETURE
                ? DateTime.fromFormat(vFormationDiplome.DATE_FERMETURE, "dd/LL/yyyy").toJSDate()
                : undefined,
              typeFamille: getTypeFamille(),
            })
            .then(() => {
              processedCfds.add(cfd);
            });
        } catch (e) {
          console.log(e);
          errorCount++;
        } finally {
          process.stdout.write(`\r${count} dataFormation (apprentissage) ajoutées ou mises à jour`);
        }
      },
      { parallel: 20 }
    );
    process.stdout.write(errorCount > 0 ? `(avec ${errorCount} erreurs)\n\n` : "\n\n");
  }
);
