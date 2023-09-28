import Boom from "@hapi/boom";
import { inject } from "injecti";
import { getPermissionScope, guardScope } from "shared";

import { logger } from "../../../../logger";
import { RequestUser } from "../../../core/model/User";
import { findOneDataEtablissement } from "../../repositories/findOneDataEtablissement.dep";
import { generateId } from "../../utils/generateId";
import { createDemandeQuery } from "./createDemandeQuery.dep";
import { findOneDataFormation } from "./findOneDataFormation.dep";
import { findOneDemande } from "./findOneDemande.dep";

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

      validations.forEach((validate) => validate(demande));

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
        libelleFCIL: null,
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
