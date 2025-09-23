import * as Boom from "@hapi/boom";
import { getPermissionScope, guardScope } from "shared";
import {PermissionEnum} from 'shared/enum/permissionEnum';

import type { RequestUser } from "@/modules/core/model/User";
import { findOneDemandeQuery } from "@/modules/demandes/repositories/findOneDemande.query";
import { findOneSimilarDemandeQuery } from "@/modules/demandes/repositories/findOneSimilarDemande.query";
import { getCurrentCampagne } from "@/modules/utils/getCurrentCampagne";
import logger from "@/services/logger";

import { createDemandeQuery } from "./dependencies/createDemande.dep";
import { getDemandeWithMetadata } from "./dependencies/getDemandeWithMetadata.dep";
import { hasAlreadyBeenImported } from "./dependencies/hasAlreadyBeenImported.dep";

const importDemandeFactory =
  (
    deps = {
      createDemandeQuery,
      findOneDemandeQuery,
      getCurrentCampagne,
      getDemandeWithMetadata,
      hasAlreadyBeenImported,
      findOneSimilarDemandeQuery,
    }
  ) =>
    async ({ numero, user }: { user: RequestUser; numero: string }) => {
      const [demande, campagne, alreadyImportedDemande] = await Promise.all([
        deps.findOneDemandeQuery(numero),
        deps.getCurrentCampagne(user),
        deps.hasAlreadyBeenImported({ numero }),
      ]);

      if (alreadyImportedDemande) {
        logger.error({
          numero,
          user
        }, "[IMPORT_INTENTION] Cette demande a déjà été importée");
        throw Boom.badRequest("Cette demande a déjà été importée", {
          id: alreadyImportedDemande.id,
          errors: {
            same_demande: "Cette demande a déjà été importée.",
          },
        });
      }

      if (!campagne) {
        logger.error({
          numero,
          user
        }, "[IMPORT_INTENTION] Aucune campagne en cours dans laquelle importer la demande");
        throw Boom.badData("Aucune campagne en cours dans laquelle importer la demande", {
          errors: {
            aucune_campagne_en_cours: "Aucune campagne en cours dans laquelle importer la demande.",
          },
        });
      }

      if (!demande) {
        logger.error({
          numero,
          user
        }, "[IMPORT_INTENTION] Aucune demande correspondant au numéro fourni");
        throw Boom.badRequest("Aucune demande correspondant au numéro fourni", {
          errors: {
            numero: numero,
            aucune_demande_correspondante: "Aucune demande correspondant au numéro fourni.",
          },
        });
      }

      const scope = getPermissionScope(user.role, PermissionEnum["demande/ecriture"]);
      const isAllowed = guardScope(scope, {
        uai: () => user.uais?.includes(demande.uai) ?? false,
        région: () => user.codeRegion === demande.codeRegion,
        national: () => true,
      });

      if (!isAllowed) throw Boom.forbidden();
      const sameDemande = await deps.findOneSimilarDemandeQuery({
        ...demande,
        notNumero: numero,
        campagneId: campagne.id,
      });
      if (sameDemande) {
        logger.error(
          {
            sameDemande,
            demande,
            user
          },
          "[IMPORT_INTENTION] Demande similaire existante"
        );
        throw Boom.badRequest("Demande similaire existante", {
          id: sameDemande.id,
          errors: {
            same_demande:
              `Une demande similaire sur la campagne ${campagne.annee} existe déjà avec ces mêmes champs: code diplôme, numéro établissement, dispositif et rentrée scolaire.`,
          },
        });
      }

      const importedDemande = await deps.createDemandeQuery({
        demande,
        campagne,
        user,
      });

      if (!importedDemande) {
        return undefined;
      }

      return deps.getDemandeWithMetadata(importedDemande.id);
    };

export const importDemandeUsecase = importDemandeFactory();
