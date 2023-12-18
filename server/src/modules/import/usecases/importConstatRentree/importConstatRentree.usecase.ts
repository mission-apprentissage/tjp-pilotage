import { inject } from "injecti";

import { rawDataRepository } from "../../repositories/rawData.repository";
import { streamIt } from "../../utils/streamIt";
import { RENTREES_SCOLAIRES } from "../importFormationEtablissement/domain/millesimes";
import { createDataConstatsRentree } from "./createDataContastRentree.dep";
import { findNMef } from "./findNMef.dep";

export const [importConstatRentree] = inject(
  {
    createDataConstatsRentree,
    findNMef,
    findRawDatas: rawDataRepository.findRawDatas,
  },
  (deps) => async () => {
    let errorCount = 0;
    for (const rentreeScolaire of RENTREES_SCOLAIRES) {
      console.log(
        `Import du constat rentrée de l'année scolaire ${rentreeScolaire}`
      );

      await streamIt(
        (offset) =>
          deps.findRawDatas({
            type: "Cab-nbre_division_effectifs_par_etab_mefst11",
            offset,
            limit: 10000,
            year: rentreeScolaire,
          }),
        async (constatRentreeLine, count) => {
          const nMef = await findNMef({
            mefstat: constatRentreeLine["Mef Bcp 11"],
          });

          const datas = {
            uai: constatRentreeLine["Numéro d'établissement"],
            mefstat11: constatRentreeLine["Mef Bcp 11"],
            effectifs: Number(constatRentreeLine["Nombre d'élèves"] ?? "0"),
            cfd: nMef.FORMATION_DIPLOME,
            anneeDispositif: Number(nMef.ANNEE_DISPOSITIF ?? "0"),
            rentreeScolaire,
          };

          try {
            await deps.createDataConstatsRentree(datas);

            process.stdout.write(
              `\r${count} constat de rentrée ajoutés ou mis à jour`
            );
          } catch (error) {
            console.log(
              `An error occured while importing datas`,
              JSON.stringify(datas, null, 2)
            );
            console.error(error);
            errorCount++;
          }
        },
        { parallel: 20 }
      );

      process.stdout.write(
        `${errorCount > 0 ? `(avec ${errorCount} erreurs)` : ""}\n\n`
      );
    }
  }
);
