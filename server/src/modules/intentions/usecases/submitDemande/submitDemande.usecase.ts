import Boom from "@hapi/boom";
import { inject } from "injecti";
import { demandeValidators, getPermissionScope, guardScope } from "shared";

import { logger } from "../../../../logger";
import { cleanNull } from "../../../../utils/noNull";
import { RequestUser } from "../../../core/model/User";
import { findOneDataEtablissement } from "../../repositories/findOneDataEtablissement.query";
import { findOneDataFormation } from "../../repositories/findOneDataFormation.query";
import { findOneDemande } from "../../repositories/findOneDemande.query";
import { generateId } from "../../utils/generateId";
import { createDemandeQuery } from "./createDemandeQuery.dep";

type Demande = {
  id?: string;
  uai: string;
  typeDemande: string;
  cfd: string;
  dispositifId: string;
  libelleFCIL?: string;
  compensationCfd?: string;
  compensationDispositifId?: string;
  compensationUai?: string;
  compensationRentreeScolaire?: number;
  motif: string[];
  autreMotif?: string;
  rentreeScolaire: number;
  amiCma: boolean;
  libelleColoration?: string;
  poursuitePedagogique?: boolean;
  commentaire?: string;
  coloration: boolean;
  mixte?: boolean;
  capaciteScolaire?: number;
  capaciteScolaireActuelle?: number;
  capaciteScolaireColoree?: number;
  capaciteApprentissage?: number;
  capaciteApprentissageActuelle?: number;
  capaciteApprentissageColoree?: number;
};

const validateDemande = (demande: Demande) => {
  let errors: Record<string, string> = {};
  for (const [key, validator] of Object.entries(demandeValidators)) {
    const error = validator(demande);
    if (!error) continue;
    errors = { ...errors, [key]: error };
  }
  return Object.keys(errors).length ? errors : undefined;
};

export const [submitDemande, submitDemandeFactory] = inject(
  {
    createDemandeQuery,
    findOneDataEtablissement,
    findOneDataFormation,
    findOneDemande,
  },
  (deps) =>
    async ({
      demande,
      user,
    }: {
      user: Pick<RequestUser, "id" | "role" | "codeRegion">;
      demande: Demande;
    }) => {
      const currentDemande = demande.id
        ? await deps.findOneDemande(demande.id)
        : undefined;

      const { cfd, uai } = demande;

      const dataEtablissement = await deps.findOneDataEtablissement({ uai });
      if (!dataEtablissement) throw Boom.badRequest("Code uai non valide");
      if (!dataEtablissement.codeRegion) throw Boom.badData();

      const scope = getPermissionScope(user.role, "intentions/envoi");
      const isAllowed = guardScope(scope?.default, {
        user: () =>
          user.codeRegion === dataEtablissement.codeRegion &&
          (!currentDemande || user.id === currentDemande?.createurId),
        region: () => user.codeRegion === dataEtablissement.codeRegion,
        national: () => true,
      });
      if (!isAllowed) throw Boom.forbidden();

      const compensationRentreeScolaire =
        demande.typeDemande === "augmentation_compensation" ||
        demande.typeDemande === "ouverture_compensation"
          ? demande.rentreeScolaire
          : undefined;

      const dataFormation = await deps.findOneDataFormation({ cfd });
      if (!dataFormation) throw Boom.badRequest("Code diplome non valide");

      const demandeData = {
        ...currentDemande,
        libelleColoration: null,
        libelleFCIL: null,
        autreMotif: null,
        commentaire: null,
        compensationCfd: null,
        compensationDispositifId: null,
        compensationUai: null,
        capaciteScolaire: 0,
        capaciteScolaireActuelle: 0,
        capaciteScolaireColoree: 0,
        capaciteApprentissage: 0,
        capaciteApprentissageActuelle: 0,
        capaciteApprentissageColoree: 0,
        mixte: false,
        poursuitePedagogique: false,
        ...demande,
        compensationRentreeScolaire,
      };

      const errors = validateDemande(cleanNull(demandeData));
      if (errors)
        throw Boom.badData("Donnée incorrectes", { errors, demandeData });

      const created = await deps.createDemandeQuery({
        ...demandeData,
        id: currentDemande?.id ?? generateId(),
        createurId: currentDemande?.createurId ?? user.id,
        status: "submitted",
        codeAcademie: dataEtablissement.codeAcademie,
        codeRegion: dataEtablissement.codeRegion,
        updatedAt: new Date(),
      });

      logger.info("Demande envoyée", { demande: created });
      return created;
    }
);
