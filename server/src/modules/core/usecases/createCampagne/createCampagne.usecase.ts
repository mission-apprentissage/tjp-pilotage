import Boom from "@hapi/boom";
import { inject } from "injecti";
import { CampagneStatutEnum } from "shared/enum/campagneStatutEnum";

import { getCampagneEnCours } from "../../queries/getCampagneEnCours";
import { getSimilarCampagne } from "../../queries/getSimilarCampagne";
import { insertCampagne } from "./createCampagne.query";
import { BodySchema } from "./createCampagne.schema";

export const [createCampagne, createCampagneFactory] = inject(
  {
    insertCampagne,
    getSimilarCampagne,
    getCampagneEnCours,
  },
  (deps) => async (campagne: BodySchema) => {
    const existingCampagne = await deps.getSimilarCampagne({ data: campagne });
    if (existingCampagne) {
      throw Boom.badRequest(
        `Une campagne similaire existe déjà pour l'année ${campagne.annee}`,
        {
          id: existingCampagne.id,
          errors: {
            campagne_similaire_existante: `Une campagne similaire existe déjà pour l'année ${campagne.annee}`,
          },
        }
      );
    }
    const campagneEnCours = await deps.getCampagneEnCours();
    if (campagneEnCours && campagne.statut === CampagneStatutEnum["en cours"]) {
      throw Boom.badRequest("Une campagne est déjà en cours", {
        id: campagneEnCours.id,
        errors: {
          campagne_en_cours_existante:
            "Une campagne est déjà en cours, veuillez la clôturer avant d'en créer une nouvelle.",
        },
      });
    }
    await insertCampagne({
      data: campagne,
    });
  }
);
