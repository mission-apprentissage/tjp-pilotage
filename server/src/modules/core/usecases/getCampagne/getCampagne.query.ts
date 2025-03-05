import * as Boom from '@hapi/boom';
import {CampagneStatutEnum} from 'shared/enum/campagneStatutEnum';

import { getKbdClient } from "@/db/db";
import type { RequestUser } from '@/modules/core/model/User';
import { cleanNull } from '@/utils/noNull';

export const getCampagneById = async ({
  campagneId,
  user
} : {
  campagneId: string,
  user?: RequestUser
}) =>
  getKbdClient()
    .selectFrom("campagne")
    .leftJoin("campagneRegion", (join) =>
      join
        .onRef("campagneRegion.campagneId", "=", "campagne.id")
        .on("campagneRegion.statut", "=", CampagneStatutEnum["en cours"])
        .$call((eb) => {
          if(user?.codeRegion) return eb.on("campagneRegion.codeRegion", "=", user.codeRegion);
          return eb.on((eb) => eb.val(false));
        })
    )
    .where("campagne.id", "=", campagneId)
    .selectAll("campagne")
    .select([
      "campagneRegion.statut as campagneRegionStatut",
      "campagneRegion.codeRegion",
      "campagneRegion.withSaisiePerdir",
      "campagneRegion.dateVote"
    ])
    .executeTakeFirstOrThrow()
    .catch(() => {
      throw Boom.notFound(`Aucune campagne nationale pour l'id ${campagneId}`);
    })
    .then((campagne) => cleanNull({
      ...campagne,
      dateDebut: campagne.dateDebut?.toISOString(),
      dateFin: campagne.dateFin?.toISOString(),
      statut: campagne.campagneRegionStatut ?? campagne.statut,
      codeRegion: campagne.codeRegion,
      withSaisiePerdir: campagne.withSaisiePerdir,
      dateVote: campagne.dateVote?.toISOString(),
    })
    );
