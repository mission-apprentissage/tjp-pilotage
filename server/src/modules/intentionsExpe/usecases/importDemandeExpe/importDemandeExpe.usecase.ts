import Boom from "@hapi/boom";
import { getPermissionScope, guardScope } from "shared";

import { RequestUser } from "../../../core/model/User";
import { getCurrentCampagneQuery } from "../../queries/getCurrentCampagne/getCurrentCampagne.query";
import { findOneDemandeExpe } from "../../repositories/findOneDemandeExpe.query";
import { createDemandeExpeQuery } from "./dependencies/createDemandeExpe.dep";
import { getDemandeWithMetadata } from "./dependencies/getDemandeWithMetadata";
import { hasAlreadyBeenImported } from "./dependencies/hasAlreadyBeenImported";

const importDemandeExpeFactory =
  (
    deps = {
      createDemandeExpeQuery,
      findOneDemandeExpe,
      getCurrentCampagneQuery,
      getDemandeWithMetadata,
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
    const [demandeExpe, campagne, alreadyImportedDemandeExpe] =
      await Promise.all([
        deps.findOneDemandeExpe(numero),
        deps.getCurrentCampagneQuery(),
        deps.hasAlreadyBeenImported({ numero }),
      ]);

    if (alreadyImportedDemandeExpe) {
      throw Boom.badRequest("Cette demandeExpe a déjà été importée", {
        id: alreadyImportedDemandeExpe.id,
        errors: {
          same_demande: "Cette demandeExpe a déjà été importée.",
        },
      });
    }

    if (!campagne) {
      throw Boom.badData(
        "Aucune campagne en cours dans laquelle importer la demandeExpe",
        {
          errors: {
            aucune_campagne_en_cours:
              "Aucune campagne en cours dans laquelle importer la demandeExpe.",
          },
        }
      );
    }

    if (!demandeExpe) {
      throw Boom.badRequest(
        "Aucune demandeExpe correspondant au numéro fourni",
        {
          errors: {
            numero: numero,
            aucune_demande_correspondante:
              "Aucune demandeExpe correspondant au numéro fourni.",
          },
        }
      );
    }

    const scope = getPermissionScope(user.role, "intentions-perdir/ecriture");
    const isAllowed = guardScope(scope?.default, {
      uai: () => user.uais?.includes(demandeExpe.uai) ?? false,
      region: () => user.codeRegion === demandeExpe.codeRegion,
      national: () => true,
    });

    if (!isAllowed) throw Boom.forbidden();

    const importedDemande = await deps.createDemandeExpeQuery({
      demandeExpe,
      campagne,
      user,
    });

    if (!importedDemande) {
      return undefined;
    }

    return deps.getDemandeWithMetadata(importedDemande.id);
  };

export const importDemandeExpeUsecase = importDemandeExpeFactory();
