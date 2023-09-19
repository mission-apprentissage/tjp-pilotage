import Boom from "@hapi/boom";
import { inject } from "injecti";
import { hasPermission } from "shared";
import { v4 as uuidv4 } from "uuid";

import { RequestUser } from "../../../core/model/User";
import { createDemandeQuery } from "./createDemandeQuery.dep";
import { findOneDataEtablissement } from "./findOneDataEtablissement.dep";
import { findOneDataFormation } from "./findOneDataFormation.dep";

type Demande = {
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
  coloration: boolean;
  mixte: boolean;
  capaciteScolaire: number;
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
  { createDemandeQuery, findOneDataEtablissement, findOneDataFormation },
  (deps) =>
    async ({
      demande,
      user,
    }: {
      user: Pick<RequestUser, "id" | "role" | "codeRegion">;
      demande: Demande;
    }) => {
      const id = demande.id ?? uuidv4();

      const dataEtablissement = await deps.findOneDataEtablissement({
        uai: demande.uai,
      });
      if (!dataEtablissement) throw Boom.badRequest("Code uai non valide");

      const codeRegion = dataEtablissement.codeRegion;
      const codeAcademie = dataEtablissement.codeAcademie;

      if (!hasPermission(user.role, "intentions/envoi")) throw Boom.forbidden();
      if (user.codeRegion && user.codeRegion !== codeRegion)
        throw Boom.forbidden();

      const dataFormation = await deps.findOneDataFormation({
        cfd: demande.cfd,
      });
      if (!dataFormation) {
        throw Boom.badRequest("Code diplome non valide");
      }

      validations.forEach((validate) => validate(demande));

      await deps.createDemandeQuery({
        demande: {
          ...demande,
          id,
          status: "submitted",
          createurId: user.id,
          codeAcademie,
          codeRegion,
        },
      });
    }
);
