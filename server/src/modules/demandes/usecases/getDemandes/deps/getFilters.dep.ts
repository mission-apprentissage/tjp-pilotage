import type { ExpressionBuilder } from "kysely";
import { sql } from "kysely";

import type { DB } from "@/db/db";
import { getKbdClient } from "@/db/db";
import { isInPerimetreIJAcademie } from "@/modules/data/utils/isInPerimetreIJ";
import type { Filters } from "@/modules/demandes/usecases/getDemandes/getDemandes.usecase";
import { getCampagnes } from '@/modules/utils/getCurrentCampagne';
import { isDemandeNotDeleted, isDemandeSelectable } from "@/modules/utils/isDemandeSelectable";
import { cleanNull } from "@/utils/noNull";

export const getFiltersQuery = async ({ user, codeAcademie, codeNiveauDiplome }: Filters) => {
  const inCodeAcademie = (eb: ExpressionBuilder<DB, "academie">) => {
    if (!codeAcademie) return sql<true>`true`;
    return eb("academie.codeAcademie", "in", codeAcademie);
  };

  const geoFiltersBase = getKbdClient()
    .selectFrom("region")
    .leftJoin("departement", "departement.codeRegion", "region.codeRegion")
    .leftJoin("academie", "academie.codeRegion", "region.codeRegion")
    .distinct()
    .$castTo<{ label: string; value: string }>()
    .orderBy("label", "asc");

  const academiesFilters = await geoFiltersBase
    .select(["academie.libelleAcademie as label", "academie.codeAcademie as value"])
    .where("academie.codeAcademie", "is not", null)
    .where(isInPerimetreIJAcademie)
    .where((eb) => {
      return eb.or([user.codeRegion ? eb("academie.codeRegion", "in", [user.codeRegion]) : sql<boolean>`true`]);
    })
    .execute();

  const filtersBase = getKbdClient()
    .selectFrom("latestDemandeView as demande")
    .leftJoin("region", "region.codeRegion", "demande.codeRegion")
    .leftJoin("dataFormation", "dataFormation.cfd", "demande.cfd")
    .leftJoin("dataEtablissement", "dataEtablissement.uai", "demande.uai")
    .leftJoin("dispositif", "dispositif.codeDispositif", "demande.codeDispositif")
    .leftJoin("niveauDiplome", "niveauDiplome.codeNiveauDiplome", "dataFormation.codeNiveauDiplome")
    .leftJoin("familleMetier", "familleMetier.cfd", "demande.cfd")
    .leftJoin("departement", "departement.codeRegion", "demande.codeRegion")
    .leftJoin("academie", "academie.codeRegion", "demande.codeRegion")
    .leftJoin("campagne", "campagne.id", "demande.campagneId")
    .where(isDemandeNotDeleted)
    .where(isDemandeSelectable({ user }))
    .distinct()
    .$castTo<{ label: string; value: string }>()
    .orderBy("label", "asc");

  const diplomesFilters = await filtersBase
    .select(["niveauDiplome.libelleNiveauDiplome as label", "niveauDiplome.codeNiveauDiplome as value"])
    .where("niveauDiplome.codeNiveauDiplome", "is not", null)
    .where((eb) => {
      return eb.or([
        inCodeAcademie(eb),
        codeNiveauDiplome ? eb("niveauDiplome.codeNiveauDiplome", "in", codeNiveauDiplome) : sql<boolean>`false`,
      ]);
    })
    .execute();


  const campagnesFilters = await getCampagnes(user);

  return {
    academies: academiesFilters.map(cleanNull),
    diplomes: diplomesFilters.map(cleanNull),
    campagnes: campagnesFilters.map(cleanNull),
  };
};
