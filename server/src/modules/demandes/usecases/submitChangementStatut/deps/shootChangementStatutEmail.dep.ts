import * as Boom from "@hapi/boom";
import type {Role} from 'shared';
import { RoleEnum} from 'shared';
import type { DemandeStatutType } from "shared/enum/demandeStatutEnum";
import { DemandeStatutEnum } from "shared/enum/demandeStatutEnum";

import { getKbdClient } from "@/db/db";
import { shootTemplate } from "@/modules/core";
import type { findOneDemandeQuery } from "@/modules/demandes/repositories/findOneDemande.query";

type DemandeData = Awaited<ReturnType<typeof findOneDemandeQuery>>;

export const shootChangementStatutEmail = async (
  previousStatut: DemandeStatutType | undefined,
  newStatut: DemandeStatutType,
  demande: DemandeData
): Promise<void> => {
  console.debug({
    previousStatut,
    newStatut,
    createdBy: demande?.createdBy,
    cfd: demande?.cfd,
    isIncomplet: newStatut === DemandeStatutEnum["dossier incomplet"],
  });

  if (previousStatut === newStatut) return;

  // Envoi un email au perdir créateur de la demande quand le statut de celle-ci passe à "Dossier incomplet"
  if (newStatut === DemandeStatutEnum["dossier incomplet"] && demande?.createdBy) {
    const owner = await getKbdClient()
      .selectFrom("user")
      .where("id", "=", demande.createdBy)
      .selectAll()
      .executeTakeFirst();

    if (!owner) {
      throw Boom.badRequest(
        `Impossible de trouver le créateur de la demande avec l'identifiant ${demande.createdBy}`
      );
    }

    const formation = await getKbdClient()
      .selectFrom("dataFormation")
      .where("cfd", "=", demande.cfd)
      .select("libelleFormation")
      .executeTakeFirst();

    if (!formation) {
      throw Boom.badRequest(`Impossible de trouver la formation avec le cfd ${demande.cfd}`);
    }

    if ((owner.role as Role) === RoleEnum["perdir"]) {
      console.debug(`Envoie de l'email demande_dossier_incomplet à ${owner.email}`);
      shootTemplate({
        to: owner.email,
        template: "demande_dossier_incomplet",
        data: {
          libelleFormation: formation.libelleFormation,
        },
        subject: `Demande de précisions sur votre proposition "${formation.libelleFormation}"`,
      });
    }
  }
};
