import type { PageRequeteEnregistreeType } from "shared/enum/pageRequeteEnregistreeEnum";

import { getKbdClient } from "@/db/db";

export const findOneSimilarRequeteEnregistreeQuery = async ({
  nom,
  couleur,
  userId,
  page,
}: {
  nom: string;
  couleur: string;
  userId: string;
  page: PageRequeteEnregistreeType;
}) => {
  return await getKbdClient()
    .selectFrom("requeteEnregistree")
    .selectAll()
    .where((w) =>
      w.and([
        w("requeteEnregistree.nom", "=", nom),
        w("requeteEnregistree.couleur", "=", couleur),
        w("requeteEnregistree.userId", "=", userId),
        w("requeteEnregistree.page", "=", page),
      ])
    )
    .executeTakeFirst();
};
