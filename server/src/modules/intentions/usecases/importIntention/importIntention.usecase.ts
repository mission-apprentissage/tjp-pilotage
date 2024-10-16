import Boom from "@hapi/boom";
import { getPermissionScope, guardScope } from "shared";

import { RequestUser } from "../../../core/model/User";
import { getCurrentCampagneQuery } from "../../queries/getCurrentCampagne/getCurrentCampagne.query";
import { findOneIntention } from "../../repositories/findOneIntention.query";
import { createIntentionQuery } from "./dependencies/createIntention.dep";
import { getIntentionWithMetadata } from "./dependencies/getIntentionWithMetadata";
import { hasAlreadyBeenImported } from "./dependencies/hasAlreadyBeenImported";

const importIntentionFactory =
  (
    deps = {
      createIntentionQuery,
      findOneIntention,
      getCurrentCampagneQuery,
      getIntentionWithMetadata,
      hasAlreadyBeenImported,
    }
  ) =>
  async ({
    numero,
    user,
  }: {
    user: Pick<RequestUser, "id" | "codeRegion" | "role" | "uais">;
    numero: string;
  }) => {
    const [intention, campagne, alreadyImportedIntention] = await Promise.all([
      deps.findOneIntention(numero),
      deps.getCurrentCampagneQuery(),
      deps.hasAlreadyBeenImported({ numero }),
    ]);

    if (alreadyImportedIntention) {
      throw Boom.badRequest("Cette demande a déjà été importée", {
        id: alreadyImportedIntention.id,
        errors: {
          same_demande: "Cette demande a déjà été importée.",
        },
      });
    }

    if (!campagne) {
      throw Boom.badData(
        "Aucune campagne en cours dans laquelle importer la demande",
        {
          errors: {
            aucune_campagne_en_cours:
              "Aucune campagne en cours dans laquelle importer la demande.",
          },
        }
      );
    }

    if (!intention) {
      throw Boom.badRequest("Aucune demande correspondant au numéro fourni", {
        errors: {
          numero: numero,
          aucune_demande_correspondante:
            "Aucune demande correspondant au numéro fourni.",
        },
      });
    }

    const scope = getPermissionScope(user.role, "intentions-perdir/ecriture");
    const isAllowed = guardScope(scope?.default, {
      uai: () => user.uais?.includes(intention.uai) ?? false,
      region: () => user.codeRegion === intention.codeRegion,
      national: () => true,
    });

    if (!isAllowed) throw Boom.forbidden();

    const importedIntention = await deps.createIntentionQuery({
      intention,
      campagne,
      user,
    });

    if (!importedIntention) {
      return undefined;
    }

    return deps.getIntentionWithMetadata(importedIntention.id);
  };

export const importIntentionUsecase = importIntentionFactory();
