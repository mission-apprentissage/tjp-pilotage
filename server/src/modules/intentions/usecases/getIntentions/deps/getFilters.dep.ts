import { ExpressionBuilder, sql } from "kysely";
import { z } from "zod";

import { DB, kdb } from "../../../../../db/db";
import { cleanNull } from "../../../../../utils/noNull";
import { RequestUser } from "../../../../core/model/User";
import { notPerimetreIJAcademie } from "../../../../data/utils/notPerimetreIJ";
import { isDemandeNotDeleted } from "../../../../utils/isDemandeSelectable";
import { isRestitutionIntentionVisible } from "../../../../utils/isRestitutionIntentionVisible";
import { getIntentionsSchema } from "../getIntentions.schema";

export interface Filters
  extends z.infer<typeof getIntentionsSchema.querystring> {
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
    .where(notPerimetreIJAcademie)
    .where((eb) => {
      return eb.or([
        user.codeRegion
          ? eb("academie.codeRegion", "in", [user.codeRegion])
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
    .where(isRestitutionIntentionVisible({ user }))
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
