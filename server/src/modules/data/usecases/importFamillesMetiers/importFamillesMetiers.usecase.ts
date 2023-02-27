import { dataDI } from "../../data.DI";
import { streamIt } from "../../utils/streamIt";
import { importFamillesMetiersDeps } from "./importFamillesMetiers.deps";

export const importFamillesMetiersFactory =
  ({
    findRawDatas = dataDI.rawDataRepository.findRawDatas,
    createFamillesMetiers = importFamillesMetiersDeps.createFamillesMetiers,
  }) =>
  async () => {
    console.log(`Import des familles de métiers`);

    let count = 0;
    await streamIt(
      (count) =>
        findRawDatas({ type: "familleMetiers", offset: count, limit: 20 }),
      async (item) => {
        const data = {
          libelleOfficielFamille: item.FAMILLE,
          libelleOfficielSpecialite: item.SPECIALITE,
          mefStat11Famille: item["MEFSTAT11 2NDE PRO"],
          mefStat11Specialite: item["MEFSTAT11 TLEPRO"],
          codeMinistereTutelle: item.CODE_MINISTERE_TUTELLE,
        };

        count++;
        process.stdout.write(`\r${count}`);
        await createFamillesMetiers([data]);
      }
    );

    process.stdout.write(
      `\r${count} familles de métiers ajoutées ou mises à jour\n`
    );
  };

export const importFamillesMetiers = importFamillesMetiersFactory({});
