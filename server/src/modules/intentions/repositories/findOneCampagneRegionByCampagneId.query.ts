import {CampagneStatutEnum} from 'shared/enum/campagneStatutEnum';
import type { CampagneType } from "shared/schema/campagneSchema";

import { getKbdClient } from "@/db/db";
import type { RequestUser } from "@/modules/core/model/User";
import {cleanNull} from '@/utils/noNull';

const getCampagneRegionByCampagneId = async ({
  campagneId,
  user
} : {
  campagneId: string,
  user: RequestUser
}) => getKbdClient()
  .selectFrom("campagneRegion")
  .where("campagneRegion.campagneId", "=", campagneId)
  .where("campagneRegion.statut", "=", CampagneStatutEnum["en cours"])
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

export const findOneCampagneRegionByCampagneId = async ({
  campagneId,
  user
} : {
  campagneId: string,
  user: RequestUser
}): Promise<CampagneType> => {
  const campagne = await getKbdClient()
    .selectFrom("campagne")
    .selectAll()
    .where("id", "=", campagneId)
    .executeTakeFirstOrThrow()
    .then((campagne) =>
      cleanNull({
        ...campagne,
        dateDebut: campagne.dateDebut.toISOString(),
        dateFin: campagne.dateFin.toISOString(),
      })
    );

  const campagneRegion = await getCampagneRegionByCampagneId({
    campagneId, user
  });

  return {
    id: campagne.id,
    annee: campagne.annee,
    dateDebut: campagne.dateDebut,
    dateFin: campagne.dateFin,
    statut: campagne.statut,
    withSaisiePerdir: campagneRegion?.withSaisiePerdir,
    dateVote: campagneRegion?.dateVote,
  };
};
