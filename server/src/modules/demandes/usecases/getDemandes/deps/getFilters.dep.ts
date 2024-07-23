import { ExpressionBuilder, sql } from "kysely";
import { z } from "zod";

import { kdb } from "../../../../../db/db";
import { DB } from "../../../../../db/schema";
import { cleanNull } from "../../../../../utils/noNull";
import { RequestUser } from "../../../../core/model/User";
import { isDemandeNotDeleted } from "../../../../utils/isDemandeSelectable";
import { isIntentionVisible } from "../../../../utils/isIntentionVisible";
import { getDemandesSchema } from "../getDemandes.schema";

export interface Filters extends z.infer<typeof getDemandesSchema.querystring> {
  user: RequestUser;
}

export const getFilters = async ({
  user,
  codeAcademie,
  codeNiveauDiplome,
}: Filters) => {
  const inCodeAcademie = (eb: ExpressionBuilder<DB, "academie">) => {
    if (!codeAcademie) return sql<true>`true`;
    return eb("academie.codeAcademie", "in", codeAcademie);
  };

  const geoFiltersBase = kdb
    .selectFrom("region")
    .leftJoin("departement", "departement.codeRegion", "region.codeRegion")
    .leftJoin("academie", "academie.codeRegion", "region.codeRegion")
    .distinct()
    .$castTo<{ label: string; value: string }>()
    .orderBy("label", "asc");

  const academiesFilters = await geoFiltersBase
    .select([
      "academie.libelleAcademie as label",
      "academie.codeAcademie as value",
    ])
    .where("academie.codeAcademie", "is not", null)
    .where("academie.codeAcademie", "not in", [
      "00",
      "54",
      "61",
      "62",
      "63",
      "67",
      "66",
      "91",
      "99",
    ])
    .where((eb) => {
      return eb.or([
        user.codeRegion
          ? eb("academie.codeRegion", "in", user.codeRegion)
          : sql<boolean>`true`,
      ]);
    })
    .execute();

  const filtersBase = kdb
    .selectFrom("latestDemandeIntentionView as demande")
    .leftJoin("region", "region.codeRegion", "demande.codeRegion")
    .leftJoin("dataFormation", "dataFormation.cfd", "demande.cfd")
    .leftJoin("dataEtablissement", "dataEtablissement.uai", "demande.uai")
    .leftJoin(
      "dispositif",
      "dispositif.codeDispositif",
      "demande.codeDispositif"
    )
    .leftJoin(
      "niveauDiplome",
      "niveauDiplome.codeNiveauDiplome",
      "dataFormation.codeNiveauDiplome"
    )
    .leftJoin("familleMetier", "familleMetier.cfd", "demande.cfd")
    .leftJoin("departement", "departement.codeRegion", "demande.codeRegion")
    .leftJoin("academie", "academie.codeRegion", "demande.codeRegion")
    .leftJoin("campagne", "campagne.id", "demande.campagneId")
    .where(isDemandeNotDeleted)
    .where(isIntentionVisible({ user }))
    .distinct()
    .$castTo<{ label: string; value: string }>()
    .orderBy("label", "asc");

  const diplomesFilters = await filtersBase
    .select([
      "niveauDiplome.libelleNiveauDiplome as label",
      "niveauDiplome.codeNiveauDiplome as value",
    ])
    .where("niveauDiplome.codeNiveauDiplome", "is not", null)
    .where((eb) => {
      return eb.or([
        inCodeAcademie(eb),
        codeNiveauDiplome
          ? eb("niveauDiplome.codeNiveauDiplome", "in", codeNiveauDiplome)
          : sql<boolean>`false`,
      ]);
    })
    .execute();

  return {
    academies: academiesFilters.map(cleanNull),
    diplomes: diplomesFilters.map(cleanNull),
  };
};
