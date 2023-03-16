import { dataDI } from "../../data.di";
import { streamIt } from "../../utils/streamIt";
import { importFamillesMetiersDeps } from "./importFamillesMetiers.deps";

export const importFamillesMetiersFactory =
  ({
    findRawDatas = dataDI.rawDataRepository.findRawDatas,
    createFamillesMetiers = importFamillesMetiersDeps.createFamillesMetiers,
    findNMef = importFamillesMetiersDeps.findNMef,
  }) =>
  async () => {
    console.log(`Import des familles de métiers`);

    let count = 0;
    await streamIt(
      (count) =>
        findRawDatas({ type: "familleMetiers", offset: count, limit: 20 }),
      async (item) => {
        const nMefFamille = await findNMef({
          mefstat: item["MEFSTAT11 2NDE PRO"],
        });
        const nMefSpecialite = await findNMef({
          mefstat: item["MEFSTAT11 TLEPRO"],
        });

        const data = {
          libelleOfficielFamille: item.FAMILLE,
          cfdFamille: nMefFamille.FORMATION_DIPLOME,
          cfdSpecialite: nMefSpecialite.FORMATION_DIPLOME,
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
