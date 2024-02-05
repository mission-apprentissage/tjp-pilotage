import fs from "fs";
import { inject } from "injecti";
import { MILLESIMES_IJ } from "shared";

import { basepath } from "../../../../../../basepath";
import { R } from "../../../../services/inserJeunesApi/formatUaiData";
import { getUaiData } from "../../../../services/inserJeunesApi/inserJeunes.api";
const DONNEES_IJ_CSV_PATH = `${basepath}/files/donneesIJ.csv`;

export const createDonneesIJFile = (): fs.WriteStream => {
  if (fs.existsSync(DONNEES_IJ_CSV_PATH)) {
    fs.truncateSync(DONNEES_IJ_CSV_PATH);
  } else {
    fs.writeFileSync(DONNEES_IJ_CSV_PATH, "");
  }
  const file = fs.createWriteStream(DONNEES_IJ_CSV_PATH);
  file.write(
    `uai;id;millesime;valeur_ajoutee_6_mois;nb_sortant;nb_annee_term;taux_emploi_6_mois;nb_en_emploi_6_mois;taux_emploi_12_mois;nb_en_emploi_12_mois;nb_poursuite_etudes;taux_poursuite_etudes\n`
  );
  return file;
};

const formatIjDataRow = (
  uai: string,
  millesime: string,
  uaiData?: R
): string => {
  if (!uaiData) return "";

  const meftstats = Object.keys(uaiData.meftstats);
  const meftstatsString = meftstats
    .map(
      (mefstat) =>
        `${[
          uai,
          mefstat,
          millesime,
          uaiData.ensemble.valeur_ajoutee_6_mois,
          uaiData.meftstats[mefstat].nb_sortant,
          uaiData.meftstats[mefstat].nb_annee_term,
          uaiData.meftstats[mefstat].taux_emploi_6_mois,
          uaiData.meftstats[mefstat].nb_en_emploi_6_mois,
          uaiData.meftstats[mefstat].taux_emploi_12_mois,
          uaiData.meftstats[mefstat].nb_en_emploi_12_mois,
          uaiData.meftstats[mefstat].nb_poursuite_etudes,
          uaiData.meftstats[mefstat].taux_poursuite_etudes,
        ].join(";")}\n`
    )
    .join("");

  const cfds = Object.keys(uaiData.cfds);
  const cfdsString = cfds
    .map(
      (cfd) =>
        `${[
          uai,
          cfd,
          millesime,
          uaiData.ensemble.valeur_ajoutee_6_mois,
          uaiData.cfds[cfd].nb_sortant,
          uaiData.cfds[cfd].nb_annee_term,
          uaiData.cfds[cfd].taux_emploi_6_mois,
          uaiData.cfds[cfd].nb_en_emploi_6_mois,
          uaiData.cfds[cfd].taux_emploi_12_mois,
          uaiData.cfds[cfd].nb_en_emploi_12_mois,
          uaiData.cfds[cfd].nb_poursuite_etudes,
          uaiData.cfds[cfd].taux_poursuite_etudes,
        ].join(";")}\n`
    )
    .join("");

  return meftstatsString + cfdsString;
};

export const [createDonneesIJ] = inject(
  { getUaiData },
  (deps) =>
    async ({ uai }: { uai: string }) => {
      for (let i = 0; i < MILLESIMES_IJ.length; i++) {
        const millesime = MILLESIMES_IJ[i];
        await deps.getUaiData({ uai, millesime }).then((data) =>
          fs.appendFile(
            DONNEES_IJ_CSV_PATH,
            formatIjDataRow(uai, millesime, data),
            (err) => {
              if (err) {
                console.log("file error", err);
                throw err;
              }
            }
          )
        );
      }
      // const promises = MILLESIMES_IJ.map(async (millesime) =>
      //   deps.getUaiData({ uai, millesime }).then((data) =>
      //     fs.appendFile(
      //       DONNEES_IJ_CSV_PATH,
      //       formatIjDataRow(uai, millesime, data),
      //       (err) => {
      //         if (err) throw err;
      //       }
      //     )
      //   )
      // );
      // Promise.all(promises);
      console.log("fetch IJ OK (uai : ", uai, ")");
    }
);
