import Boom from "@hapi/boom";
import { inject } from "injecti";
import { assertScopeIsAllowed, getPermissionScope } from "shared";
import { v4 as uuidv4 } from "uuid";

import { RequestUser } from "../../../core/model/User";
import { createDemandeQuery } from "./createDemandeQuery.dep";
import { findOneDataEtablissement } from "./findOneDataEtablissement.dep";
import { findOneDataFormation } from "./findOneDataFormation.dep";
import { findOneDemande } from "./findOneDemande.dep";

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

      const { cfd, uai } = demande;

      const dataEtablissement = await deps.findOneDataEtablissement({ uai });
      if (!dataEtablissement) throw Boom.badRequest("Code uai non valide");

      if (dataEtablissement.codeRegion !== user.codeRegion)
        throw Boom.forbidden();

      validations.forEach((validate) => validate(demande));

      const dataFormation = await deps.findOneDataFormation({ cfd });
      if (!dataFormation) throw Boom.badRequest("Code diplome non valide");

      return await deps.createDemandeQuery({
        ...currentDemande,
        ...demande,
        id: currentDemande?.id ?? uuidv4(),
        createurId: currentDemande?.createurId ?? user.id,
        status: "submitted",
        codeAcademie: dataEtablissement.codeAcademie,
        codeRegion: dataEtablissement.codeRegion,
      });
    }
);
