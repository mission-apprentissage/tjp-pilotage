import { dataDI } from "../../data.di";
import { streamIt } from "../../utils/streamIt";
import { importFamillesMetiersDeps } from "./importFamillesMetiers.deps";

export const importFamillesMetiersFactory =
  ({
    findRawDatas = dataDI.rawDataRepository.findRawDatas,
    createFamillesMetiers = importFamillesMetiersDeps.createFamillesMetiers,
  }) =>
  async () => {
    console.log(`Import des familles de métiers`);

    let countFamillesMetier = 0;
    await streamIt(
      (countFamillesMetier) =>
        findRawDatas({
          type: "familleMetiers",
          offset: countFamillesMetier,
          limit: 20,
        }),
      async (item) => {
        const data = {
          libelleOfficielFamille: item.FAMILLE,
          cfdFamille: item.CFD_COMMUN,
          cfdSpecialite: item.CFD_SPECIALITE,
          libelleOfficielSpecialite: item.SPECIALITE,
          codeMinistereTutelle: item.CODE_MINISTERE_TUTELLE,
        };

        countFamillesMetier++;
        process.stdout.write(`\r${countFamillesMetier}`);
        await createFamillesMetiers(data);
      }
    );

    process.stdout.write(
      `\r${countFamillesMetier} familles de métiers ajoutées ou mises à jour\n\n`
    );

    console.log(`Import des options BTS`);

    let countOptionsBTS = 0;
    await streamIt(
      (countOptionsBTS) =>
        findRawDatas({
          type: "optionsBTS",
          offset: countOptionsBTS,
          limit: 20,
        }),
      async (item) => {
        const data = {
          libelleOfficielFamille: item.FAMILLE,
          cfdFamille: item.CFD_COMMUN,
          cfdSpecialite: item.CFD_SPECIALITE,
          libelleOfficielSpecialite: item.SPECIALITE,
          codeMinistereTutelle: item.CODE_MINISTERE_TUTELLE,
        };

        countOptionsBTS++;
        process.stdout.write(`\r${countOptionsBTS}`);
        await createFamillesMetiers(data);
      }
    );

    process.stdout.write(
      `\r${countOptionsBTS} options de BTS ajoutées ou mises à jour\n\n`
    );
  };

export const importFamillesMetiers = importFamillesMetiersFactory({});
