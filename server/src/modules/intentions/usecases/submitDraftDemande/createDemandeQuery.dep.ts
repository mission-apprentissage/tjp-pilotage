import { Insertable } from "kysely";

import { kdb } from "../../../../db/db";
import { DB } from "../../../../db/schema";

export const createDemandeQuery = async ({
  demande,
}: {
  demande: Insertable<DB["demande"]>;
}) => {
  return await kdb
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
        motif: null,
        poursuitePedagogique: null,
        rentreeScolaire: null,
        typeDemande: null,
        compensationCfd: null,
        compensationDispositifId: null,
        compensationUai: null,
        compensationRentreeScolaire: null,
        uai: null,
        coloration: null,
        mixte: null,
        capaciteScolaire: null,
        capaciteScolaireActuelle: null,
        capaciteScolaireColoree: null,
        capaciteApprentissage: null,
        capaciteApprentissageActuelle: null,
        capaciteApprentissageColoree: null,
        ...demande,
      })
    )
    .returning(["id"])
    .executeTakeFirst();
};
