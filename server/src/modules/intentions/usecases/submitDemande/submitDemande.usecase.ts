import Boom from "@hapi/boom";
import { inject } from "injecti";

import { checkUai } from "../checkUai/checkUai.usecase";
import { createDemandeQuery } from "./createDemandeQuery.dep";
export const [submitDemande] = inject(
  { createDemandeQuery, checkUai },
  (deps) =>
    async ({
      demande,
      userId,
    }: {
      userId: string;
      demande: {
        uai: string;
        typeDemande: string;
        cfd: string;
        libelleDiplome: string;
        dispositifId: string;
        motif: string[];
        autreMotif?: string;
        rentreeScolaire: number;
        amiCma: boolean;
        libelleColoration?: string;
        poursuitePedagogique: boolean;
        commentaire?: string;
      };
    }) => {
      const id = `${new Date().getFullYear().toString()}-${Math.random()
        .toFixed(20)
        .slice(2)}`;

      const uaiStatus = await deps.checkUai({ uai: demande.uai });
      if (uaiStatus.status !== "valid") {
        throw Boom.badRequest("Code uai non valide");
      }

      const codeRegion = uaiStatus.data.codeRegion;
      const codeAcademie = uaiStatus.data.codeAcademie;

      await deps.createDemandeQuery({
        demande: {
          ...demande,
          id,
          status: "submitted",
          createurId: userId,
          codeAcademie,
          codeRegion,
        },
      });
    }
);
