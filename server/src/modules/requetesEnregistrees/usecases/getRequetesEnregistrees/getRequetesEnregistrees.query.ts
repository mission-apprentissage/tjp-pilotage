import type { PageRequeteEnregistreeType } from "shared/enum/pageRequeteEnregistreeEnum";
import type { z } from "zod";

import { getKbdClient } from "@/db/db";
import type { RequestUser } from "@/modules/core/model/User";

import type { FiltresFormationEtablissementSchema, FiltresFormationSchema } from "./getRequetesEnregistrees.schema";

type FormationFiltresType = z.infer<typeof FiltresFormationSchema>;
type FormationEtablissementFiltresType = z.infer<typeof FiltresFormationEtablissementSchema>;

export const getRequetesEnregistrees = ({ user, page }: { user: RequestUser; page: PageRequeteEnregistreeType }) => {
  return getKbdClient()
    .selectFrom("requeteEnregistree")
    .selectAll()
    .where((w) => w.and([w("requeteEnregistree.userId", "=", user.id), w("requeteEnregistree.page", "=", page)]))
    .distinct()
    .orderBy("nom", "asc")
    .execute()
    .then((requetesEnregistrees) =>
      requetesEnregistrees.map((requeteEnregistree) => ({
        ...requeteEnregistree,
        filtres: requeteEnregistree.filtres as FormationFiltresType | FormationEtablissementFiltresType,
      }))
    );
};
