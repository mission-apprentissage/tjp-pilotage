import Boom from "@hapi/boom";
import { inject } from "injecti";
import { getPermissionScope, guardScope } from "shared";

import { logger } from "../../../../logger";
import { RequestUser } from "../../../core/model/User";
import { findOneDataEtablissement } from "../../repositories/findOneDataEtablissement.query";
import { findOneDemande } from "../../repositories/findOneDemande.query";
import { generateId } from "../../utils/generateId";
import { createDemandeQuery } from "./createDemandeQuery.dep";
import { findOneDataFormation } from "./findOneDataFormation.dep";

type Demande = {
  id?: string;
  uai: string;
  typeDemande: string;
  cfd: string;
  dispositifId: string;
  compensationCfd?: string;
  compensationDispositifId?: string;
  compensationUai?: string;
  compensationRentreeScolaire?: number;
  motif: string[];
  autreMotif?: string;
  rentreeScolaire: number;
  amiCma: boolean;
  libelleColoration?: string;
  poursuitePedagogique: boolean;
  commentaire?: string;
  coloration: boolean;
  mixte: boolean;
  capaciteScolaireActuelle?: number;
  capaciteScolaireColoree?: number;
  capaciteApprentissage?: number;
  capaciteApprentissageActuelle?: number;
  capaciteApprentissageColoree?: number;
};

const validators = {
  motif: (demande: Partial<Demande>) => {
    if (!demande.motif?.length) {
      return "motifs manquant";
    }
  },
  autreMotif: (demande: Partial<Demande>) => {
    if (demande.motif?.includes("autre_motif") && !demande.autreMotif) {
      return "autreMotif manquant";
    }
  },
  libelleColoration: (demande: Partial<Demande>) => {
    if (demande.coloration && !demande.libelleColoration) {
      return "libelleColoration manquant";
    }
  },
  capaciteColoration: (demande: Partial<Demande>) => {
    if (
      demande.coloration &&
      !demande.capaciteApprentissageColoree &&
      !demande.capaciteScolaireColoree
    ) {
      return "Capacité colorée manquante";
    }
  },
  capaciteApprentissage: (demande: Partial<Demande>) => {
    if (!demande.mixte && demande.capaciteApprentissage) {
      return "Capacité apprentissage invalide";
    }
    if (demande.mixte && !demande.capaciteApprentissage) {
      return "Capacité apprentissage manquante";
    }
  },
};

const validateDemande = (demande: Demande) => {
  let errors: string[] = [];
  for (const validator of Object.values(validators)) {
    const error = validator(demande);
    if (!error) continue;
    errors = [...errors, error];
  }
  return errors;
};

const validations = [
  (demande: Demande) => {
    if (!demande.motif.length) {
      throw Boom.badRequest("motifs manquant");
    }
  },
  (demande: Demande) => {
    if (demande.motif.includes("autre_motif") && !demande.autreMotif) {
      throw Boom.badRequest("autreMotif manquant");
    }
  },
  (demande: Demande) => {
    if (demande.coloration && !demande.libelleColoration) {
      throw Boom.badRequest("libelleColoration manquant");
    }
  },
  (demande: Demande) => {
    if (
      demande.coloration &&
      !demande.capaciteApprentissageColoree &&
      !demande.capaciteScolaireColoree
    ) {
      throw Boom.badRequest("Capacité colorée manquante");
    }
  },
  (demande: Demande) => {
    if (!demande.mixte && demande.capaciteApprentissage) {
      throw Boom.badRequest("Capacité apprentissage invalide");
    }
  },
  (demande: Demande) => {
    if (demande.mixte && !demande.capaciteApprentissage) {
      throw Boom.badRequest("Capacité apprentissage manquante");
    }
  },
];

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

      const errors = validateDemande(demande);
      if (errors?.length) {
        throw Boom.badData("Donnée incorrectes", { errors });
      }

      const dataFormation = await deps.findOneDataFormation({ cfd });
      if (!dataFormation) throw Boom.badRequest("Code diplome non valide");

      const compensationRentreeScolaire =
        demande.typeDemande === "augmentation_compensation" ||
        demande.typeDemande === "ouverture_compensation"
          ? demande.rentreeScolaire
          : undefined;

      const created = await deps.createDemandeQuery({
        ...currentDemande,
        libelleColoration: null,
        autreMotif: null,
        commentaire: null,
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
        status: "submitted",
        codeAcademie: dataEtablissement.codeAcademie,
        codeRegion: dataEtablissement.codeRegion,
        updatedAt: new Date(),
      });

      logger.info("Demande envoyée", { demande: created });
    }
);
