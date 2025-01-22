
import Boom from "@hapi/boom";
import {CampagneStatutEnum} from 'shared/enum/campagneStatutEnum';
import type {CampagneSchema} from 'shared/schema/campagneSchema';

import {getKbdClient} from '@/db/db';
import type { RequestUser } from "@/modules/core/model/User";
import { cleanNull } from '@/utils/noNull';

const getCampagnesEnCours = async () => {
  return getKbdClient()
    .selectFrom("campagne")
    .where("statut", "=", CampagneStatutEnum["en cours"])
    .selectAll()
    .orderBy("annee", "asc")
    .execute()
    .then((campagnes) =>
      campagnes.map((campagne) => cleanNull({
        ...campagne,
        dateDebut: campagne.dateDebut.toISOString(),
        dateFin: campagne.dateFin.toISOString(),
      }))
    );
};

const getCampagneOfCampagneRegionEnCours = async ({
  codeRegion
} : {
  codeRegion: string
}) => {
  return getKbdClient()
    .selectFrom("campagne")
    .innerJoin("campagneRegion", "campagneRegion.campagneId", "campagne.id")
    .where((eb) =>
      eb.and([
        eb("campagne.statut", "=", CampagneStatutEnum["en cours"]),
        eb("campagneRegion.statut", "=", CampagneStatutEnum["en cours"]),
        eb("campagneRegion.codeRegion", "=", codeRegion)
      ])
    )
    .selectAll("campagne")
    .executeTakeFirst()
    .then((campagne) =>
      campagne ?
        cleanNull({
          ...campagne,
          dateDebut: campagne.dateDebut.toISOString(),
          dateFin: campagne.dateFin.toISOString(),
        }) :
        undefined
    );
};

/**
 *
 * Si aucune campagne n'est en cours on renvoie undefined
 * Si une seule campagne est en cours on la renvoie
 * Si plusieurs campagnes sont en cours
 *  Si l'utilisateur est rattaché à une région et qu'une campagne régionale est en cours pour cette région, on renvoie la campagne nationale associée
 *  Sinon on renvoie la plus vieille campagne nationale en cours
 *
 * @param user
 * @returns
 */
export const getCurrentCampagne = async (user: RequestUser): Promise<CampagneSchema> => {
  const campagnesEnCours = await getCampagnesEnCours();
  if (!campagnesEnCours || campagnesEnCours.length === 0) {
    throw Boom.notFound(`Aucune campagne nationale en cours, veuillez en créer une dans l'écran dédié`);
  }
  if (campagnesEnCours.length === 1) return campagnesEnCours[0];
  const codeRegion = user.codeRegion;
  if(codeRegion) {
    const campagneEnCours =  await getCampagneOfCampagneRegionEnCours({ codeRegion });
    if (campagneEnCours) return campagneEnCours;
  }
  return campagnesEnCours[0];
};
