import { Insertable } from "kysely";

import { kdb } from "../../../../db/db";
import { DB } from "../../../../db/schema";

export const createDemandeQuery = async ({
  demande,
}: {
  demande: Insertable<DB["demande"]>;
}) => {
  await kdb
    .insertInto("demande")
    .values(demande)
    .onConflict((oc) =>
      oc.column("id").doUpdateSet({
        libelleColoration: null,
        autreMotif: null,
        amiCma: null,
        cfd: null,
        codeAcademie: null,
        codeRegion: null,
        commentaire: null,
        dispositifId: null,
        libelleDiplome: null,
        motif: null,
        poursuitePedagogique: null,
        rentreeScolaire: null,
        typeDemande: null,
        uai: null,
        coloration: null,
        ...demande,
      })
    )
    .execute();
};
