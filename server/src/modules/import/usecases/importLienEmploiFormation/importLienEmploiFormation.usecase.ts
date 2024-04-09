import { Insertable } from "kysely";

import { DB } from "../../../../db/db";
import { dataDI } from "../../data.di";
import { streamIt } from "../../utils/streamIt";
import { importLienEmploiFormation as importLienEmploiFormationDeps } from "./importLienEmploiFormation.deps";

export const importLienEmploiFormationFactory =
  ({
    findRawDatas = dataDI.rawDataRepository.findRawDatas,
    createDomaineProfessionnel = importLienEmploiFormationDeps.createDomaineProfessionnel,
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

        console.log(item);

        await createDomaineProfessionnel(data);

        countDomaineProfessionnel++;
        process.stdout.write(`\r${countDomaineProfessionnel}`);
      },
      { parallel: 20 }
    );
  };

export const importLienEmploiFormation = importLienEmploiFormationFactory({});
