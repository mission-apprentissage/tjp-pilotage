import Boom from "@hapi/boom";
import { inject } from "injecti";

import { getCampagneEnCours } from "../../queries/getCampagneEnCours";
import { updateCampagneQuery } from "./editCampagne.query";
import { BodySchema } from "./editCampagne.schema";

export const [editCampagneUsecase] = inject(
  { updateCampagneQuery, getCampagneEnCours },
  (deps) =>
    async ({
      campagneId,
      campagne,
    }: {
      campagneId: string;
      campagne: BodySchema;
    }) => {
      const campagneEnCours = await deps.getCampagneEnCours();
      if (campagneEnCours && campagne.statut === "en cours") {
        throw Boom.badRequest("Une campagne est déjà en cours", {
          id: campagneEnCours.id,
          errors: {
            campagne_en_cours_existante:
              "Une campagne est déjà en cours, veuillez la clôturer avant d'en créer une nouvelle.",
          },
        });
      }
      return await deps.updateCampagneQuery({
        campagneId,
        campagne,
      });
    }
);
