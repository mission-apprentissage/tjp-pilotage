import { Insertable } from "kysely";

import { DB } from "../../../../db/db";
import { dataDI } from "../../data.di";
import { streamIt } from "../../utils/streamIt";
import { importLienEmploiFormation as importLienEmploiFormationDeps } from "./importLienEmploiFormation.deps";

export const importLienEmploiFormationFactory =
  ({
    findRawDatas = dataDI.rawDataRepository.findRawDatas,
    createDomaineProfessionnel = importLienEmploiFormationDeps.createDomaineProfessionnel,
    createRome = importLienEmploiFormationDeps.createRome,
    createMetier = importLienEmploiFormationDeps.createMetier,
  }) =>
  async () => {
    console.log(`Import des domaines professionnels`);

    let domainesProfessionnels = 0;
    await streamIt(
      (countDomaineProfessionnel) =>
        findRawDatas({
          type: "domaine_professionnel",
          offset: countDomaineProfessionnel,
          limit: 20,
        }),
      async (item) => {
        const data: Insertable<DB["domaineProfessionnel"]> = {
          codeDomaineProfessionnel: item.code_domaine_professionnel,
          libelleDomaineProfessionnel: item.libelle_domaine_professionnel,
        };

        await createDomaineProfessionnel(data);

        domainesProfessionnels++;
        process.stdout.write(`\r${domainesProfessionnels}`);
      },
      { parallel: 20 }
    );

    console.log(`\nImport des fiches ROME`);
    let rome = 0;
    await streamIt(
      (countRome) =>
        findRawDatas({
          type: "rome",
          offset: countRome,
          limit: 20,
        }),
      async (item) => {
        const data: Insertable<DB["rome"]> = {
          codeRome: item.code_rome,
          libelleRome: item.libelle_rome,
          codeDomaineProfessionnel: item.code_rome.substring(0, 3),
        };

        await createRome(data);

        rome++;
        process.stdout.write(`\r${rome}`);
      },
      { parallel: 20 }
    );

    console.log(`\nImport des métiers`);
    let metiers = 0;
    await streamIt(
      (countMetier) =>
        findRawDatas({
          type: "metier",
          offset: countMetier,
          limit: 20,
        }),
      async (item) => {
        const data: Insertable<DB["metier"]> = {
          codeRome: item.code_rome.trim(),
          libelleMetier: item.libelle_appellation_long.trim(),
          codeMetier: item.code_ogr.trim(),
        };

        await createMetier(data);

        metiers++;
        process.stdout.write(`\r${metiers}`);
      },
      { parallel: 20 }
    );
  };

export const importLienEmploiFormation = importLienEmploiFormationFactory({});
