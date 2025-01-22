import Boom from "@hapi/boom";
// eslint-disable-next-line import/no-extraneous-dependencies, n/no-extraneous-import
import { inject } from "injecti";
import { getPermissionScope, guardScope } from "shared";
import type {FiltersSchema} from 'shared/routes/schemas/post.intention.import.numero.schema';
import type {z} from 'zod';

import type { RequestUser } from "@/modules/core/model/User";
import { findOneDemandeQuery } from "@/modules/demandes/repositories/findOneDemande.query";
import { getCurrentCampagne } from "@/modules/utils/getCurrentCampagne";

import { createDemandeQuery } from "./dependencies/createDemande.dep";
import { getDemandeWithMetadata } from "./dependencies/getDemandeWithMetadata";
import { hasAlreadyBeenImported } from "./dependencies/hasAlreadyBeenImported";

export interface Filters extends z.infer<typeof FiltersSchema> {
  user: RequestUser;
}
export const [importDemande, importDemandeFactory] = inject(
  {
    createDemandeQuery,
    findOneDemandeQuery,
    getCurrentCampagne,
    getDemandeWithMetadata,
    hasAlreadyBeenImported,
  },
  (deps) =>
    async ({ numero, user }: Filters) => {
      const [demande, campagne, alreadyImportedDemande] = await Promise.all([
        deps.findOneDemandeQuery(numero),
        deps.getCurrentCampagne(user),
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
        throw Boom.badData("Aucune campagne en cours dans laquelle importer la demande", {
          errors: {
            aucune_campagne_en_cours: "Aucune campagne en cours dans laquelle importer la demande.",
          },
        });
      }

      if (!demande) {
        throw Boom.badRequest("Aucune demande correspondant au numéro fourni", {
          errors: {
            numero: numero,
            aucune_demande_correspondante: "Aucune demande correspondant au numéro fourni.",
          },
        });
      }

      const scope = getPermissionScope(user.role, "intentions/ecriture");
      const isAllowed = guardScope(scope?.default, {
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
