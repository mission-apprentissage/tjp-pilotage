import { Insertable } from "kysely";
import _ from "lodash";

import { DB } from "../../../../db/db";
import { dataDI } from "../../data.di";
import { streamIt } from "../../utils/streamIt";
import { importNSFGroupeSpecialite } from "./importNSF.deps";

const normalizeLibelleLong = (libelleLong: string) => {
  return _.capitalize(
    libelleLong.replace(/DO[0-9]+\s:\s/i, "").toLocaleLowerCase()
  );
};

export const importNSFFactory =
  ({
    findRawDatas = dataDI.rawDataRepository.findRawDatas,
    createNSFGroupeSpecialite = importNSFGroupeSpecialite.createNSFGroupeSpecialite,
  }) =>
  async () => {
    console.log(`Import des spécialité de familles de métiers`);

    let countNSFGroupeSpecialite = 0;
    await streamIt(
      (countNSFGroupeSpecialite) =>
        findRawDatas({
          type: "n_groupe_specialite_",
          offset: countNSFGroupeSpecialite,
          limit: 20,
        }),
      async (item) => {
        const data: Insertable<DB["nsf"]> = {
          codeNsf: item.GROUPE_SPECIALITE,
          libelleNsf:
            item.LIBELLE_EDITION ||
            normalizeLibelleLong(item.LIBELLE_LONG) ||
            "",
        };

        await createNSFGroupeSpecialite(data);

        countNSFGroupeSpecialite++;
        process.stdout.write(`\r${countNSFGroupeSpecialite}`);
      },
      { parallel: 20 }
    );
  };

export const importNSF = importNSFFactory({});
