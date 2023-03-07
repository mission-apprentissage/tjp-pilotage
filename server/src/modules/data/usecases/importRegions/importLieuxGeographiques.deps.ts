import { db, pool } from "../../../../db/zapatos";
import { Academie } from "../../entities/Academie";
import { Departement } from "../../entities/Departement";
import { Region } from "../../entities/Region";
import { Departements_academies_regions } from "../../files/Departements_academies_regions";
import { rawDataRepository } from "../../repositories/rawData.repository";

const createRegions = async (regions: Region[]) => {
  await db.upsert("region", regions, "codeRegion").run(pool);
};

const createAcademie = async (academie: Academie) => {
  await db.upsert("academie", academie, "codeAcademie").run(pool);
};

const createDepartement = async (departement: Departement) => {
  await db.upsert("departement", departement, "codeDepartement").run(pool);
};

const findDepartementAcademieRegions = async ({
  offset,
  limit,
}: {
  offset?: number;
  limit?: number;
}): Promise<Departements_academies_regions[]> =>
  rawDataRepository.findRawDatas({
    type: "departements_academies_regions",
    offset,
    limit,
  });

export const importRegionsDeps = {
  createRegions,
  createAcademie,
  createDepartement,
  findDepartementAcademieRegions,
};
