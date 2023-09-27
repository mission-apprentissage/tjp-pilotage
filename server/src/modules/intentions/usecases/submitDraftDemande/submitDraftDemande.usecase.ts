import Boom from "@hapi/boom";
import { inject } from "injecti";
import { getPermissionScope, guardScope } from "shared";

import { RequestUser } from "../../../core/model/User";
import { findOneDataEtablissement } from "../../repositories/findOneDataEtablissement.dep";
import { generateId } from "../../utils/generateId";
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
        dispositifId?: string;
        motif?: string[];
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

      const compensationRentreeScolaire =
        demande.typeDemande === "augmentation_compensation" ||
        demande.typeDemande === "ouverture_compensation"
          ? demande.rentreeScolaire
          : undefined;

      return await deps.createDemandeQuery({
        ...currentDemande,
        libelleColoration: null,
        autreMotif: null,
        amiCma: null,
        cfd: null,
        commentaire: null,
        dispositifId: null,
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
        compensationCfd: null,
        compensationDispositifId: null,
        compensationUai: null,
        ...demande,
        compensationRentreeScolaire,
        id: currentDemande?.id ?? generateId(),
        createurId: currentDemande?.createurId ?? user.id,
        status: "draft",
        codeAcademie: dataEtablissement.codeAcademie,
        codeRegion: dataEtablissement.codeRegion,
        updatedAt: new Date(),
      });
    }
);
