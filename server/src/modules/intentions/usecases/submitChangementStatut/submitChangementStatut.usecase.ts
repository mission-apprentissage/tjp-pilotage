import Boom from "@hapi/boom";
import { inject } from "injecti";
import { getPermissionScope, guardScope } from "shared";
import {
  DemandeStatutEnum,
  DemandeStatutType,
} from "shared/enum/demandeStatutEnum";
import { z } from "zod";

import { logger } from "../../../../logger";
import { RequestUser } from "../../../core/model/User";
import { findOneIntention } from "../../repositories/findOneIntention.query";
import { updateIntentionWithHistory } from "../../repositories/updateIntentionWithHistory.query";
import { createChangementStatutQuery } from "./deps/createChangementStatut.query";
import { submitChangementStatutSchema } from "./submitChangementStatut.schema";

const logChangementStatut = (
  intention?: {
    numero: string;
  },
  changementStatut?: {
    statutPrecedent?: DemandeStatutType;
    statut: DemandeStatutType;
  }
) => {
  if (!changementStatut || !intention) return;
  if (changementStatut.statutPrecedent)
    return logger.info(
      `Changement de statut depuis ${changementStatut.statutPrecedent} vers ${changementStatut.statut} pour l'intention ${intention.numero}`,
      {
        changementStatut,
      }
    );
  switch (changementStatut.statut) {
    case DemandeStatutEnum["proposition"]:
      logger.info("Projet de demande enregistré", {
        intention: intention,
      });
      break;
    case DemandeStatutEnum["demande validée"]:
      logger.info("Demande validée", { intention: intention });
      break;
    case DemandeStatutEnum["refusée"]:
      logger.info("Demande refusée", { intention: intention });
      break;
  }
};

type ChangementStatut = z.infer<
  typeof submitChangementStatutSchema.body
>["changementStatut"];

export const [submitChangementStatutUsecase, submitChangementStatutFactory] =
  inject(
    {
      createChangementStatutQuery,
      updateIntentionWithHistory,
      findOneIntention,
    },
    (deps) =>
      async ({
        user,
        changementStatut,
      }: {
        user: Pick<RequestUser, "id" | "role" | "codeRegion" | "uais">;
        changementStatut: ChangementStatut;
      }) => {
        const scope = getPermissionScope(
          user.role,
          "intentions-perdir-statut/ecriture"
        );

        const intentionData = await findOneIntention(
          changementStatut.intentionNumero
        );
        if (!intentionData) throw Boom.notFound("Intention not found");

        const isAllowed = guardScope(scope?.default, {
          region: () => user.codeRegion === intentionData.codeRegion,
          national: () => true,
        });
        if (!isAllowed) throw Boom.forbidden();

        const newChangementStatut = {
          ...changementStatut,
          userId: user.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        const newIntention = {
          ...intentionData,
          statut: changementStatut.statut,
          updatedAt: new Date(),
        };

        const createdIntention =
          await deps.updateIntentionWithHistory(newIntention);

        const createdChangementStatut =
          await deps.createChangementStatutQuery(newChangementStatut);

        logChangementStatut(createdIntention, createdChangementStatut);

        return {
          ...createdIntention,
          statut: createdChangementStatut.statut,
          statutPrecedent: createdChangementStatut.statutPrecedent,
        };
      }
  );
