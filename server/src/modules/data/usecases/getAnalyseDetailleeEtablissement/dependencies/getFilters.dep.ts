import { sql } from "kysely";
import type { Voie } from "shared/enum/voieEnum";

import { cleanNull } from "@/utils/noNull";

import { getBase } from "./base.dep";

export const getFiltersVoie = async ({ uai, codeNiveauDiplome }: { uai: string; codeNiveauDiplome?: string[] }) =>
  getBase({ uai })
    .select(["voie"])
    .distinct()
    .$call((q) => {
      if (codeNiveauDiplome?.length) {
        q = q.where("dataFormation.codeNiveauDiplome", "in", codeNiveauDiplome);
      }

      return q;
    })
    .$castTo<{ voie: Voie }>()
    .execute();

export const getFiltersCodeNiveauDiplome = async ({ uai, voie }: { uai: string; voie?: string[] }) =>
  getBase({
    uai,
  })
    .select((eb) => [
      "libelleNiveauDiplome as label",
      "dataFormation.codeNiveauDiplome as value",
      sql<number>`COUNT(DISTINCT CONCAT(
             ${eb.ref("dataEtablissement.uai")},
             ${eb.ref("dataFormation.cfd")},
             COALESCE(${eb.ref("formationEtablissement.codeDispositif")},''),
             ${eb.ref("formationEtablissement.voie")}
           ))`.as("nbOffres"),
    ])
    .$call((q) => {
      if (voie?.length) {
        q = q.where("formationEtablissement.voie", "in", voie);
      }

      return q;
    })
    .groupBy(["label", "value"])
    .orderBy(["label asc"])
    .$castTo<{
      label: string;
      value: string;
      nbOffres: number;
    }>()
    .execute()
    .then((filters) =>
      cleanNull({
        diplomes: filters.map(cleanNull),
      })
    );

export const getFilters = async ({
  uai,
  voie,
  codeNiveauDiplome,
}: {
  uai: string;
  voie?: string[];
  codeNiveauDiplome?: string[];
}) => {
  const [voies, codeNiveauDiplomeFilters] = await Promise.all([
    getFiltersVoie({ uai, codeNiveauDiplome }),
    getFiltersCodeNiveauDiplome({ uai, voie }),
  ]);

  return {
    voies: voies.map((v) => v.voie),
    ...codeNiveauDiplomeFilters,
  };
};
