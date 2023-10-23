import { inject } from "injecti";

import { DB } from "../../../../db/schema";
import { rawDataRepository } from "../../repositories/rawData.repository";
import { streamIt } from "../../utils/streamIt";
import { createDataEtablissement } from "./createDataEtablissement.dep";
import { findDepartement } from "./findDepartement.dep";

export const [importDataEtablissements] = inject(
  {
    createDataEtablissement,
    findRawDatas: rawDataRepository.findRawDatas,
    findDepartement,
  },
  (deps) => async () => {
    await streamIt(
      (offset) =>
        deps.findRawDatas({ type: "lyceesACCE", offset, limit: 10000 }),
      async (lyceeACCE, count) => {
        const codeDepartement = formatCodeDepartement(
          lyceeACCE.departement_insee_3
        );

        const departement =
          codeDepartement && (await deps.findDepartement({ codeDepartement }));

        try {
          await deps.createDataEtablissement({
            uai: lyceeACCE.numero_uai,
            siret: lyceeACCE.numero_siren_siret_uai,
            codeAcademie: departement?.codeAcademie,
            codeRegion: departement?.codeRegion,
            codeDepartement,
            libelle: lyceeACCE.appellation_officielle,
            adresse: lyceeACCE.adresse_uai,
            commune: lyceeACCE.commune_libe,
            codePostal: lyceeACCE.code_postal_uai,
            secteur: lyceeACCE.secteur_public_prive,
            codeMinistereTutuelle: lyceeACCE.ministere_tutelle,
            typeUai: lyceeACCE.type_uai as DB["dataEtablissement"]["typeUai"],
          });
        } catch (e) {
          console.log(e);
        }

        console.info(
          `${count}: dataEtablissement added ${lyceeACCE.numero_uai}`
        );
      },
      { parallel: 20 }
    );
  }
);

const formatCodeDepartement = (codeInsee: string | undefined) => {
  if (!codeInsee) return;
  if (codeInsee.length === 3) return codeInsee as `${number}${number}${string}`;
  if (codeInsee.length === 2)
    return `0${codeInsee}` as `${number}${number}${string}`;
};
