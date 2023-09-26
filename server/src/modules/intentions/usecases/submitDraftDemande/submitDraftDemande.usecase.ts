import Boom from "@hapi/boom";
import { inject } from "injecti";
import { getPermissionScope, guardScope } from "shared";
import { v4 as uuidv4 } from "uuid";

import { RequestUser } from "../../../core/model/User";
import { findOneDataEtablissement } from "../../repositories/findOneDataEtablissement.dep";
import { createDemandeQuery } from "./createDemandeQuery.dep";
import { findOneDemande } from "./findOneDemande.dep";

export const [submitDraftDemande] = inject(
  { createDemandeQuery, findOneDemande, findOneDataEtablissement },
  (deps) =>
    async ({
      demande,
      user,
    }: {
      user: Pick<RequestUser, "id" | "role" | "codeRegion">;
      demande: {
        id?: string;
        uai: string;
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

      const { uai } = demande;

      const dataEtablissement = await deps.findOneDataEtablissement({ uai });
      if (!dataEtablissement) throw Boom.badRequest("Code uai non valide");
      if (!dataEtablissement.codeRegion) throw Boom.badData();

      const scope = getPermissionScope(user.role, "intentions/envoi");
      const isAllowed = guardScope(scope?.default, {
        user: () => !currentDemande || user.id === currentDemande?.createurId,
        region: () => user.codeRegion === dataEtablissement.codeRegion,
        national: () => true,
      });
      if (!isAllowed) throw Boom.forbidden();

      return await deps.createDemandeQuery({
        ...currentDemande,
        libelleColoration: null,
        autreMotif: null,
        amiCma: null,
        cfd: null,
        commentaire: null,
        dispositifId: null,
        libelleDiplome: null,
        motif: null,
        poursuitePedagogique: null,
        rentreeScolaire: null,
        typeDemande: null,
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
        codeAcademie: dataEtablissement.codeAcademie,
        codeRegion: dataEtablissement.codeRegion,
        updatedAt: new Date(),
      });
    }
);
