import { inject } from "injecti";
import { v4 as uuidv4 } from "uuid";

import { createDemandeQuery } from "./createDemandeQuery.dep";

export const [submitDraftDemande] = inject(
  { createDemandeQuery },
  (deps) =>
    async ({
      demande,
      userId,
    }: {
      userId: string;
      demande: {
        id?: string;
        uai?: string;
        typeDemande?: string;
        cfd?: string;
        libelleDiplome?: string;
        dispositifId?: string;
        motif?: string[];
        autreMotif?: string;
        rentreeScolaire?: number;
        amiCma?: boolean;
        libelleColoration?: string;
        poursuitePedagogique?: boolean;
        commentaire?: string;
        coloration?: boolean;
        mixte?: boolean;
        capaciteScolaire?: number;
        capaciteScolaireActuelle?: number;
        capaciteScolaireColoree?: number;
        capaciteApprentissage?: number;
        capaciteApprentissageActuelle?: number;
        capaciteApprentissageColoree?: number;
      };
    }) => {
      const id = demande.id ?? uuidv4();

      return await deps.createDemandeQuery({
        demande: {
          ...demande,
          id,
          status: "draft",
          createurId: userId,
        },
      });
    }
);
