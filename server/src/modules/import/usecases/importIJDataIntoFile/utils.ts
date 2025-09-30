import fs from "fs";
import { pipeline, Writable } from "stream";

import type { IjRegionData } from "@/modules/import/services/inserJeunesApi/formatRegionData";
import type { IJDataWithValeurAjoutee, IJUaiData } from "@/modules/import/services/inserJeunesApi/formatUaiData";
import { getStreamParser } from "@/modules/import/utils/parse";

export type IJDataRow = {
  id: string;
  millesime: string;
  code_region_ij: string;
  code_region: string;
  voie: string;
  uai: string;
  nb_annee_term: string;
  nb_en_emploi_12_mois: string;
  nb_en_emploi_18_mois: string;
  nb_en_emploi_24_mois: string;
  nb_en_emploi_6_mois: string;
  nb_poursuite_etudes: string;
  nb_sortant: string;
  taux_emploi_12_mois: string;
  taux_emploi_18_mois: string;
  taux_emploi_24_mois: string;
  taux_emploi_6_mois: string;
  taux_poursuite_etudes: string;
};

export const createIJRegionDataFile = async (filepath: string) => {
  if (!fs.existsSync(filepath)) {
    console.log("Création du fichier: ", filepath);

    fs.writeFileSync(filepath, "\ufeff", { encoding: "utf-8" });
    const file = fs.createWriteStream(filepath, { flags: "a", encoding: "utf-8" });

    file.write(
      `id;millesime;code_region_ij;code_region;voie;cfd;mefstat11;nb_annee_term;nb_en_emploi_12_mois;nb_en_emploi_18_mois;nb_en_emploi_24_mois;nb_en_emploi_6_mois;nb_poursuite_etudes;nb_sortant;taux_emploi_12_mois;taux_emploi_18_mois;taux_emploi_24_mois;taux_emploi_6_mois;taux_poursuite_etudes\n`
    );
  }
};

export const getIJRegionDataId = (millesime: string, codeRegionIj: string, voie: string, cfd: string, mefstat11: string) => {
  return `${millesime}_${codeRegionIj}_${voie}_${cfd ? cfd : mefstat11}`;
};

export const appendIJRegionDataFile = async (
  {file, data, codeRegionIj, codeRegion, millesime, existingIds}
  :
  {file: fs.WriteStream, data: IjRegionData, codeRegionIj: string, codeRegion: string, millesime: string, existingIds: Set<string>}) => {
  let totalAppends = 0;
  for (const [voie, voieData] of Object.entries(data)) {
    for (const [cfdOuMefstat11, data] of Object.entries(voieData)) {

      const isScolaire = voie === "scolaire";
      const cfd = isScolaire ? "" : cfdOuMefstat11;
      const mefstat11 = isScolaire ? cfdOuMefstat11 : "";

      const id = getIJRegionDataId(millesime, codeRegionIj, voie, cfd, mefstat11);

      if (existingIds.has(id)) {
        continue;
      }

      const csvDatas = [
        id,
        millesime,
        codeRegionIj,
        codeRegion,
        voie,
        cfd,
        mefstat11,
        data.nb_annee_term,
        data.nb_en_emploi_12_mois,
        data.nb_en_emploi_18_mois,
        data.nb_en_emploi_24_mois,
        data.nb_en_emploi_6_mois,
        data.nb_poursuite_etudes,
        data.nb_sortant,
        data.taux_emploi_12_mois,
        data.taux_emploi_18_mois,
        data.taux_emploi_24_mois,
        data.taux_emploi_6_mois,
        data.taux_poursuite_etudes,
      ].map((value) => typeof value === "undefined" ? "" : value.toString()).join(";");
      file.write(`${csvDatas}\n`);
      totalAppends++;
    }
  }
  return totalAppends;
};

export const createIJUaiDataFile = async (filepath: string) => {
  if (!fs.existsSync(filepath)) {
    fs.writeFileSync(filepath, "\ufeff", { encoding: "utf-8" });
    const file = fs.createWriteStream(filepath, { flags: "a", encoding: "utf-8" });

    file.write(
      `id;millesime;code_region_ij;code_region;uai;voie;cfd;mefstat;ensemble;nb_annee_term;nb_en_emploi_12_mois;nb_en_emploi_18_mois;nb_en_emploi_24_mois;nb_en_emploi_6_mois;nb_poursuite_etudes;nb_sortant;taux_emploi_12_mois;taux_emploi_18_mois;taux_emploi_24_mois;taux_emploi_6_mois;taux_poursuite_etudes;valeur_ajoutee_6_mois\n`
    );
  }
};

export const getIJUaiDataId = (
  millesime: string,
  codeRegionIj: string,
  uai: string,
  voie: string,
  cfd_mefstat_ensemble: string,
) => {
  return `${millesime}_${codeRegionIj}_${uai}_${voie}_${cfd_mefstat_ensemble}`;
};

type AppendIJUaiDataFileParams = {
  file: fs.WriteStream,
  data: IJUaiData,
  codeRegionIj: string,
  codeRegion: string,
  millesime: string,
  existingIds: Set<string>,
  uai:string,
}

function formatIJUaiCsvRow(params: {
  id: string;
  millesime: string;
  codeRegionIj: string;
  codeRegion: string;
  uai: string;
  voie: string;
  cfd: string;
  mefstat: string;
  ensemble: string;
  data: IJDataWithValeurAjoutee;
}) {
  const values = [
    params.id,
    params.millesime,
    params.codeRegionIj,
    params.codeRegion,
    params.uai,
    params.voie,
    params.cfd,
    params.mefstat,
    params.ensemble,
    params.data.nb_annee_term,
    params.data.nb_en_emploi_12_mois,
    params.data.nb_en_emploi_18_mois,
    params.data.nb_en_emploi_24_mois,
    params.data.nb_en_emploi_6_mois,
    params.data.nb_poursuite_etudes,
    params.data.nb_sortant,
    params.data.taux_emploi_12_mois,
    params.data.taux_emploi_18_mois,
    params.data.taux_emploi_24_mois,
    params.data.taux_emploi_6_mois,
    params.data.taux_poursuite_etudes,
    params.data.valeur_ajoutee_6_mois
  ];

  return values.map((value) => typeof value === "undefined" ? "" : value.toString()).join(";");
}

export const appendIJUaiDataFile = async (
  params:AppendIJUaiDataFileParams
) => {
  const {file, data, codeRegionIj, codeRegion, millesime, existingIds, uai} = params;

  let totalAppends = 0;

  for (const [voie, voieData] of Object.entries(data)) {
    if(voie === "ensemble") {
      for (const [ensemble, data] of Object.entries(voieData)) {

        const id = getIJUaiDataId(millesime, codeRegionIj, uai, voie, ensemble);
        const cfd = "";
        const mefstat = "";

        if (existingIds.has(id)) {
          continue;
        }

        const csvDatas = formatIJUaiCsvRow({
          id,
          millesime,
          codeRegionIj,
          codeRegion,
          uai,
          voie,
          cfd,
          mefstat,
          ensemble,
          data: data as IJDataWithValeurAjoutee,
        });

        file.write(`${csvDatas}\n`);
        totalAppends++;
      }
    } else if (voie === "scolaire") {
      for (const [mefstat, data] of Object.entries(voieData)) {

        const id = getIJUaiDataId(millesime, codeRegionIj, uai, voie, mefstat);
        const cfd = "";
        const ensemble = "";

        if (existingIds.has(id)) {
          continue;
        }

        const csvDatas = formatIJUaiCsvRow({
          id,
          millesime,
          codeRegionIj,
          codeRegion,
          uai,
          voie,
          cfd,
          mefstat,
          ensemble,
          data: data as IJDataWithValeurAjoutee,
        });

        file.write(`${csvDatas}\n`);
        totalAppends++;
      }
    } else if (voie === "apprentissage") {
      for (const [cfd, data] of Object.entries(voieData)) {

        const id = getIJUaiDataId(millesime, codeRegionIj, uai, voie, cfd);
        const mefstat = "";
        const ensemble = "";

        if (existingIds.has(id)) {
          continue;
        }

        const csvDatas = formatIJUaiCsvRow({
          id,
          millesime,
          codeRegionIj,
          codeRegion,
          uai,
          voie,
          cfd,
          mefstat,
          ensemble,
          data: data as IJDataWithValeurAjoutee,
        });

        file.write(`${csvDatas}\n`);
        totalAppends++;
      }
    }
  }

  return totalAppends;
};


export async function loadIdsFromFile(filePath: string): Promise<Set<string>> {
  const ids = new Set<string>();

  return new Promise((resolve, reject) => {
    const parser = getStreamParser();

    pipeline(
      fs.createReadStream(filePath),
      parser,
      new Writable({
        objectMode: true,
        write(chunk: IJDataRow, _encoding, callback) {
          if (chunk.id) {
            ids.add(chunk.id);
          }
          callback();
        },
      }),
      (err) => {
        if (err) {
          reject(err);
        } else {
          resolve(ids);
        }
      }
    );
  });
}
