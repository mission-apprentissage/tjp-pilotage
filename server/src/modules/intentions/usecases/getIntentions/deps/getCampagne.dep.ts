import * as Boom from "@hapi/boom";
import type { CampagneType } from "shared/schema/campagneSchema";

import { getKbdClient } from "@/db/db";
import type { RequestUser } from "@/modules/core/model/User";
import {cleanNull} from '@/utils/noNull';

const getCampagneRegion = async ({
  campagneId,
  user
} : {
  campagneId: string,
  user: RequestUser
}) => getKbdClient()
  .selectFrom("campagneRegion")
  .where("campagneRegion.campagneId", "=", campagneId)
  .$call((q) => {
    if(user?.codeRegion) return q.where("codeRegion", "=", user.codeRegion);
    return q.where((w) => w.val(false));
  })
  .selectAll()
  .executeTakeFirst()
  .then((campagneRegion) =>
    campagneRegion ?
      cleanNull({
        ...campagneRegion,
        dateDebut: campagneRegion.dateDebut.toISOString(),
        dateFin: campagneRegion.dateFin.toISOString(),
        dateVote: campagneRegion.dateVote?.toISOString(),
      }) :
      undefined
  );

export const getCampagneQuery = async ({
  anneeCampagne,
  user
} : {
  anneeCampagne: string,
  user: RequestUser
}): Promise<CampagneType> => {
  const campagne = await getKbdClient()
    .selectFrom("campagne")
    .selectAll()
    .where("annee", "=", anneeCampagne)
    .executeTakeFirstOrThrow()
    .then((campagne) =>
      cleanNull({
        ...campagne,
        dateDebut: campagne.dateDebut.toISOString(),
        dateFin: campagne.dateFin.toISOString(),
      })
    )
    .catch(() => {
      throw Boom.notFound(`Aucune campagne pour l'année ${anneeCampagne}`);
    });

  const campagneRegion = await getCampagneRegion({
    campagneId: campagne.id, user
  });

  return {
    id: campagne.id,
    annee: campagne.annee,
    dateDebut: campagne.dateDebut,
    dateFin: campagne.dateFin,
    statut: campagneRegion?.statut ?? campagne.statut,
    withSaisiePerdir: campagneRegion?.withSaisiePerdir,
    dateVote: campagneRegion?.dateVote,
    codeRegion: campagneRegion?.codeRegion,
  };
};
