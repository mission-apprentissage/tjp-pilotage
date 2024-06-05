import Boom from "@hapi/boom";
import { Role } from "shared";
import {
  DemandeStatutEnum,
  DemandeStatutType,
} from "shared/enum/demandeStatutEnum";

import { kdb } from "../../../../../db/db";
import { shootTemplate } from "../../../../core";
import { findOneIntention } from "../../../repositories/findOneIntention.query";

type IntentionData = Awaited<ReturnType<typeof findOneIntention>>;

export const shootChangementStatutEmail = async (
  previousStatut: DemandeStatutType | undefined,
  newStatut: DemandeStatutType,
  intention: IntentionData
): Promise<void> => {
  console.debug({
    previousStatut,
    newStatut,
    createdBy: intention?.createdBy,
    cfd: intention?.cfd,
    isIncomplet: newStatut === DemandeStatutEnum["dossier incomplet"],
  });

  if (previousStatut === newStatut) return;

  // Envoi un email au perdir créateur de l'intention quand le statut de celle-ci passe à "Dossier incomplet"
  if (
    newStatut === DemandeStatutEnum["dossier incomplet"] &&
    intention?.createdBy
  ) {
    const owner = await kdb
      .selectFrom("user")
      .where("id", "=", intention.createdBy)
      .selectAll()
      .executeTakeFirst();

    if (!owner) {
      throw Boom.badRequest(
        `Impossible de trouver le créateur de l'intention avec l'identifiant ${intention.createdBy}`
      );
    }

    const formation = await kdb
      .selectFrom("dataFormation")
      .where("cfd", "=", intention.cfd)
      .select("libelleFormation")
      .executeTakeFirst();

    if (!formation) {
      throw Boom.badRequest(
        `Impossible de trouver la formation avec le cfd ${intention.cfd}`
      );
    }

    if ((owner.role as Role) === "perdir") {
      console.debug(
        `Envoie de l'email intention_dossier_incomplet à ${owner.email}`
      );
      shootTemplate({
        to: owner.email,
        template: "intention_dossier_incomplet",
        data: {
          libelleFormation: formation.libelleFormation,
        },
        subject: `Demande de précisions sur votre proposition "${formation.libelleFormation}"`,
      });
    }
  }
};
