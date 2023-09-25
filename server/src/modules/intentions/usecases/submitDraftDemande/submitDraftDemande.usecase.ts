import Boom from "@hapi/boom";
import { inject } from "injecti";
import { assertScopeIsAllowed, getPermissionScope } from "shared";
import { v4 as uuidv4 } from "uuid";

import { RequestUser } from "../../../core/model/User";
import { createDemandeQuery } from "./createDemandeQuery.dep";
import { findOneDemande } from "./findOneDemande.dep";

export const [submitDraftDemande] = inject(
  { createDemandeQuery, findOneDemande },
  (deps) =>
    async ({
      demande,
      user,
    }: {
      user: Pick<RequestUser, "id" | "role" | "codeRegion">;
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
      const currentDemande = demande.id
        ? await deps.findOneDemande(demande.id)
        : undefined;

      const scope = getPermissionScope(user.role, "intentions/envoi");
      assertScopeIsAllowed(scope?.default, {
        user: () => {
          if (
            currentDemande?.createurId &&
            user.id !== currentDemande?.createurId
          )
            throw Boom.forbidden();
        },
        national: () => {},
        region: () => {
          if (
            currentDemande?.codeRegion &&
            user.codeRegion !== currentDemande?.codeRegion
          ) {
            throw Boom.forbidden();
          }
        },
      });

      const codeRegion = currentDemande?.codeRegion ?? user.codeRegion;
      if (!codeRegion) throw "missing code region";

      return await deps.createDemandeQuery({
        ...currentDemande,
        libelleColoration: null,
        autreMotif: null,
        amiCma: null,
        cfd: null,
        codeAcademie: null,
        commentaire: null,
        dispositifId: null,
        libelleDiplome: null,
        motif: null,
        poursuitePedagogique: null,
        rentreeScolaire: null,
        typeDemande: null,
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
        id: currentDemande?.id ?? uuidv4(),
        createurId: currentDemande?.createurId ?? user.id,
        status: "draft",
        codeRegion,
      });
    }
);
