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
  }) =>
  async () => {
    console.log(`Import des domaines professionnels`);

    let countDomaineProfessionnel = 0;
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

        countDomaineProfessionnel++;
        process.stdout.write(`\r${countDomaineProfessionnel}`);
      },
      { parallel: 20 }
    );

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

        countDomaineProfessionnel++;
        process.stdout.write(`\r${countDomaineProfessionnel}`);
      },
      { parallel: 20 }
    );
  };

export const importLienEmploiFormation = importLienEmploiFormationFactory({});
