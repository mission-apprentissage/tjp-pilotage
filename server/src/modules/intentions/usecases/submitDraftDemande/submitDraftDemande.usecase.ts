import { inject } from "injecti";

import { checkUai } from "../checkUai/checkUai.usecase";
import { createDemandeQuery } from "./createDemandeQuery.dep";
export const [submitDraftDemande] = inject(
  { createDemandeQuery, checkUai },
  (deps) =>
    async ({
      demande,
      userId,
    }: {
      userId: string;
      demande: {
        id?: string;
        uai?: string;
        cfd?: string;
        dispositifId?: string;
        motif?: string[];
        typeDemande?: string;
        compensationCfd?: string;
        compensationDispositifId?: string;
        compensationUai?: string;
        compensationRentreeScolaire?: number;
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
      const id =
        demande.id ??
        `${new Date().getFullYear().toString()}-${Math.random()
          .toFixed(20)
          .slice(2)}`;

      demande.compensationRentreeScolaire =
        demande.typeDemande === "augmentation_compensation" ||
        demande.typeDemande === "ouverture_compensation"
          ? demande.rentreeScolaire
          : undefined;

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
