import { inject } from "injecti";
import _ from "lodash";
import { DateTime } from "luxon";

import { rawDataRepository } from "../../repositories/rawData.repository";
import { streamIt } from "../../utils/streamIt";
import { getCfdDispositifs } from "../getCfdRentrees/getCfdRentrees.usecase";
import { createDataFormation } from "./createDataFormation.dep";
import { findDiplomeProfessionnel } from "./findDiplomeProfessionnel.dep";
import { findFamilleMetier } from "./findFamilleMetier.dep";
import { findNFormationDiplome } from "./findNFormationDiplome.dep";
import { findRegroupements } from "./findRegroupements.dep";

const ancienDiplomeFields = [
  "ANCIEN_DIPLOME_1",
  "ANCIEN_DIPLOME_2",
  "ANCIEN_DIPLOME_3",
  "ANCIEN_DIPLOME_4",
  "ANCIEN_DIPLOME_5",
  "ANCIEN_DIPLOME_6",
  "ANCIEN_DIPLOME_7",
] as const;

export const [importDataFormations] = inject(
  {
    findDiplomeProfessionnel,
    findRegroupements,
    findNFormationDiplome,
    createDataFormation,
    getCfdDispositifs,
    findFamilleMetier,
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
        const diplomeProfessionnel = await deps.findDiplomeProfessionnel({
          cfd,
        });

        const dispositifs = await deps.getCfdDispositifs({ cfd });
        const mefstats = dispositifs.flatMap((dispositif) =>
          dispositif.anneesDispositif.map((item) => item.mefstat)
        );
        const regroupement = await deps.findRegroupements({ mefstats });

        const ancienCfds = ancienDiplomeFields
          .map((item) => nFormationDiplome[item])
          .filter((item): item is string => !!item);

        const contexteFamilleMetier =
          !!(await deps.findFamilleMetier(cfd)) ||
          (ancienCfds.length === 1 &&
            !!(await deps.findFamilleMetier(ancienCfds[0])));

        await deps.createDataFormation({
          cfd,
          libelle:
            (diplomeProfessionnel?.["Intitulé de la spécialité (et options)"] ||
              formatLibelle(nFormationDiplome.LIBELLE_LONG_200)) ??
            undefined,
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
          contexteFamilleMetier,
        });

        console.log(`${count}: dataFormation added ${cfd}`);
      }
    );
  }
);

const formatLibelle = (libelle?: string) =>
  libelle && _.capitalize(libelle).replace(/ \(.*\)/, "");
