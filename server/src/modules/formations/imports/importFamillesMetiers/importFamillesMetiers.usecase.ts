import fs from "fs";

import { FamillesMetiersLine } from "../../files/FamilleMetiers";
import { parseSync } from "../../utils/parseSync";
import { createFamillesMetiers as createFamillesMetiersDep } from "./createFamilleMetier";

export const importFamillesMetiersFactory =
  () =>
  async ({
    familleMetiersContent = fs.readFileSync(
      `${__dirname}/../../files/familleMetiers.csv`,
      "utf8"
    ),
    createFamillesMetiers = createFamillesMetiersDep,
  } = {}) => {
    console.log(`Import des familles de métiers`);
    const lines: FamillesMetiersLine[] = parseSync(familleMetiersContent);

    const famillesMetiers = lines.map((line) => ({
      libelleOfficielFamille: line.FAMILLE,
      libelleOfficielSpecialite: line.SPECIALITE,
      mefStat11Famille: line["MEFSTAT11 2NDE PRO"],
      mefStat11Specialite: line["MEFSTAT11 TLEPRO"],
      codeMinistereTutelle: line.CODE_MINISTERE_TUTELLE,
    }));

    console.log(
      `${famillesMetiers.length} familles de métiers vont être ajoutées ou mises à jour`
    );

    await createFamillesMetiers(famillesMetiers);

    console.log(
      `${famillesMetiers.length} familles de métiers ajoutées ou mises à jour`
    );
  };

export const importFamillesMetiers = importFamillesMetiersFactory();
