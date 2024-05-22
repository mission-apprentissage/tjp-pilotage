import Boom from "@hapi/boom";
import { inject } from "injecti";
import { getPermissionScope, guardScope } from "shared";

import { RequestUser } from "../../../core/model/User";
import { getCurrentCampagneQuery } from "../../queries/getCurrentCampagne/getCurrentCampagne.query";
import { findOneDemande } from "../../repositories/findOneDemande.query";
import { createDemandeQuery } from "./dependencies/createDemande.dep";
import { getDemandeWithMetadata } from "./dependencies/getDemandeWithMetadata";
import { hasAlreadyBeenImported } from "./dependencies/hasAlreadyBeenImported";

export const [importDemande, importDemandeFactory] = inject(
  {
    createDemandeQuery,
    findOneDemande,
    getCurrentCampagneQuery,
    getDemandeWithMetadata,
    hasAlreadyBeenImported,
  },
  (deps) =>
    async ({
      numero,
      user,
    }: {
      user: Pick<RequestUser, "id" | "codeRegion" | "role">;
      numero: string;
    }) => {
      const [demande, campagne, alreadyImportedDemande] = await Promise.all([
        deps.findOneDemande(numero),
        deps.getCurrentCampagneQuery(),
        deps.hasAlreadyBeenImported({ numero }),
      ]);

      if (alreadyImportedDemande) {
        throw Boom.badRequest("Cette demande a déjà été importée", {
          id: alreadyImportedDemande.id,
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

      if (!demande) {
        throw Boom.badRequest("Aucune demande correspondant au numéro fourni", {
          errors: {
            numero: numero,
            aucune_demande_correspondante:
              "Aucune demande correspondant au numéro fourni.",
          },
        });
      }

      const scope = getPermissionScope(user.role, "intentions/ecriture");
      const isAllowed = guardScope(scope?.default, {
        user: () =>
          user.codeRegion === demande.codeRegion &&
          (!demande || user.id === demande?.createdBy),
        region: () => user.codeRegion === demande.codeRegion,
        national: () => true,
      });

      if (!isAllowed) throw Boom.forbidden();

      const importedDemande = await deps.createDemandeQuery({
        demande,
        campagne,
        user,
      });

      if (!importedDemande) {
        return undefined;
      }

      return deps.getDemandeWithMetadata(importedDemande.id);
    }
);
