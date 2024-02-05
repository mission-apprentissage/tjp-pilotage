import fs from "fs";
import { inject } from "injecti";
import { MILLESIMES_IJ_REG } from "shared";

import { basepath } from "../../../../../../basepath";
import { regionAcademiqueMapping } from "../../../../domain/regionAcademiqueMapping";
import { IjRegionData } from "../../../../services/inserJeunesApi/formatRegionData";
import { getRegionData } from "../../../../services/inserJeunesApi/inserJeunes.api";
const DONNEES_IJ_REG_CSV_PATH = `${basepath}/files/donneesIJReg.csv`;

export const createDonneesIJRegFile = (): fs.WriteStream => {
  if (fs.existsSync(DONNEES_IJ_REG_CSV_PATH)) {
    fs.truncateSync(DONNEES_IJ_REG_CSV_PATH);
  } else {
    fs.writeFileSync(DONNEES_IJ_REG_CSV_PATH, "");
  }
  const file = fs.createWriteStream(DONNEES_IJ_REG_CSV_PATH);
  file.write(
    `codeRegion;id;voie;millesime;nb_sortant;nb_annee_term;taux_emploi_6_mois;nb_en_emploi_6_mois;taux_emploi_12_mois;nb_en_emploi_12_mois;nb_poursuite_etudes;taux_poursuite_etudes\n`
  );
  return file;
};

const formatIjDataRow = (
  codeRegion: string,
  millesime: string,
  regionData?: IjRegionData
): string => {
  if (!regionData) return "";

  const meftstats = Object.keys(regionData.meftstats);
  const meftstatsString = meftstats
    .map(
      (mefstat) =>
        `${[
          codeRegion,
          mefstat,
          millesime,
          "scolaire",
          regionData.meftstats[mefstat].nb_sortant,
          regionData.meftstats[mefstat].nb_annee_term,
          regionData.meftstats[mefstat].taux_emploi_6_mois,
          regionData.meftstats[mefstat].nb_en_emploi_6_mois,
          regionData.meftstats[mefstat].taux_emploi_12_mois,
          regionData.meftstats[mefstat].nb_en_emploi_12_mois,
          regionData.meftstats[mefstat].nb_poursuite_etudes,
          regionData.meftstats[mefstat].taux_poursuite_etudes,
        ].join(";")}\n`
    )
    .join("");

  const cfds = Object.keys(regionData.cfds);
  const cfdsString = cfds
    .map(
      (cfd) =>
        `${[
          codeRegion,
          cfd,
          millesime,
          "apprentissage",
          regionData.cfds[cfd].nb_sortant,
          regionData.cfds[cfd].nb_annee_term,
          regionData.cfds[cfd].taux_emploi_6_mois,
          regionData.cfds[cfd].nb_en_emploi_6_mois,
          regionData.cfds[cfd].taux_emploi_12_mois,
          regionData.cfds[cfd].nb_en_emploi_12_mois,
          regionData.cfds[cfd].nb_poursuite_etudes,
          regionData.cfds[cfd].taux_poursuite_etudes,
        ].join(";")}\n`
    )
    .join("");

  return meftstatsString + cfdsString;
};

export const [createDonneesIJReg] = inject(
  { getRegionData },
  (deps) => async () => {
    for (const [codeRegionIj, codeRegion] of Object.entries(
      regionAcademiqueMapping
    )) {
      const promises = MILLESIMES_IJ_REG.map(async (millesime) => {
        const data = await deps.getRegionData({ codeRegionIj, millesime });
        await fs.appendFile(
          DONNEES_IJ_REG_CSV_PATH,
          formatIjDataRow(codeRegion, millesime, data),
          (err) => {
            if (err) throw err;
          }
        );
      });
      await Promise.all(promises);
      console.log("fetch IJ Reg OK", codeRegionIj);
    }
  }
);
