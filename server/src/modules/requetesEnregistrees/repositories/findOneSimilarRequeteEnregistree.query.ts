import { PageRequeteEnregistreeType } from "shared/enum/pageRequeteEnregistreeEnum";

import { kdb } from "../../../db/db";

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
  return await kdb
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
