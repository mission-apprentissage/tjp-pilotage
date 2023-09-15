import Boom from "@hapi/boom";
import { randomUUID } from "crypto";
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
        id?: string;
        uai: string;
        typeDemande: string;
        cfd: string;
        dispositifId: string;
        motif: string[];
        autreMotif?: string;
        rentreeScolaire: number;
        amiCma: boolean;
        libelleColoration?: string;
        poursuitePedagogique: boolean;
        commentaire?: string;
        coloration?: boolean;
        capaciteScolaire: number;
        capaciteApprentissage: number;
      };
    }) => {
      const id =
        demande.id ?? `${new Date().getFullYear().toString()}-${randomUUID()}`;

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
