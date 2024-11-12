import { PageRequeteEnregistreeType } from "shared/enum/pageRequeteEnregistreeEnum";
import { z } from "zod";

import { kdb } from "../../../../db/db";
import { RequestUser } from "../../../core/model/User";
import {
  FiltresFormationEtablissementSchema,
  FiltresFormationSchema,
} from "./getRequetesEnregistrees.schema";

type FormationFiltresType = z.infer<typeof FiltresFormationSchema>;
type FormationEtablissementFiltresType = z.infer<
  typeof FiltresFormationEtablissementSchema
>;

export const getRequetesEnregistrees = ({
  user,
  page,
}: {
  user: RequestUser;
  page: PageRequeteEnregistreeType;
}) => {
  return kdb
    .selectFrom("requeteEnregistree")
    .selectAll()
    .where((w) =>
      w.and([
        w("requeteEnregistree.userId", "=", user.id),
        w("requeteEnregistree.page", "=", page),
      ])
    )
    .distinct()
    .orderBy("nom", "asc")
    .execute()
    .then((requetesEnregistrees) =>
      requetesEnregistrees.map((requeteEnregistree) => ({
        ...requeteEnregistree,
        filtres: requeteEnregistree.filtres as
          | FormationFiltresType
          | FormationEtablissementFiltresType,
      }))
    );
};
