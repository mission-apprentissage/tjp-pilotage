
import Boom from "@hapi/boom";
import {CampagneStatutEnum} from 'shared/enum/campagneStatutEnum';
import type { CampagneType } from 'shared/schema/campagneSchema';

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

const getCampagneRegionEnCours = async ({
  codeRegion
} : {
  codeRegion: string
}) => getKbdClient()
  .selectFrom("campagneRegion")
  .where((eb) =>
    eb.and([
      eb("statut", "=", CampagneStatutEnum["en cours"]),
      eb("codeRegion", "=", codeRegion)
    ])
  )
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

const getCampagneById = async ({
  campagneId
} : {
  campagneId: string
}) => getKbdClient()
  .selectFrom("campagne")
  .where("id", "=", campagneId)
  .selectAll()
  .executeTakeFirstOrThrow()
  .then((campagne) =>
    cleanNull({
      ...campagne,
      dateDebut: campagne.dateDebut.toISOString(),
      dateFin: campagne.dateFin.toISOString(),
    })
  );

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
export const getCurrentCampagne = async (user?: RequestUser): Promise<CampagneType> => {
  const campagnesEnCours = await getCampagnesEnCours();
  if (!campagnesEnCours || campagnesEnCours.length === 0) {
    throw Boom.notFound(`Aucune campagne nationale en cours, veuillez en créer une dans l'écran dédié`);
  }
  const codeRegion = user?.codeRegion;
  if(codeRegion) {
    const campagneRegionEnCours = await getCampagneRegionEnCours({ codeRegion });
    if (campagneRegionEnCours) {
      const campagneEnCours = await getCampagneById(campagneRegionEnCours);
      if (campagneEnCours) return {
        id: campagneEnCours.id,
        annee: campagneEnCours.annee,
        dateDebut: campagneEnCours.dateDebut,
        dateFin: campagneEnCours.dateFin,
        statut: campagneEnCours.statut,
        hasCampagneRegionEnCours: campagneRegionEnCours.statut === CampagneStatutEnum["en cours"],
        codeRegion: campagneRegionEnCours.codeRegion,
        withSaisiePerdir: campagneRegionEnCours.withSaisiePerdir,
        dateVote: campagneRegionEnCours.dateVote,
      };
    }
  }
  return campagnesEnCours[0];
};


export const getPreviousCampagne = async () => {
  return getKbdClient()
    .selectFrom("campagne")
    .where("statut", "=", CampagneStatutEnum["terminée"])
    .selectAll()
    .orderBy("annee", "desc")
    .executeTakeFirstOrThrow()
    .catch(() => {
      throw Boom.notFound(`Aucune campagne nationale n'est terminée, veuillez en terminer une dans l'écran dédié`);
    })
    .then((campagne) => cleanNull({
      ...campagne,
      dateDebut: campagne.dateDebut.toISOString(),
      dateFin: campagne.dateFin.toISOString(),
    }));
};

export const getCampagnes = async (user?: RequestUser): Promise<Array<CampagneType>> => getKbdClient()
  .selectFrom("campagne")
  .leftJoin("campagneRegion", (join) =>
    join
      .onRef("campagneRegion.campagneId", "=", "campagne.id")
      .$call((eb) => {
        if(user?.codeRegion) return eb.on("campagneRegion.codeRegion", "=", user.codeRegion);
        return eb.on((eb) => eb.val(false));
      })
  )
  .selectAll("campagne")
  .select([
    "campagneRegion.statut as campagneRegionStatut",
    "campagneRegion.codeRegion",
    "campagneRegion.withSaisiePerdir",
    "campagneRegion.dateVote"
  ])
  .orderBy("annee desc")
  .execute()
  .then((campagnes) =>
    campagnes.map((campagne) => cleanNull({
      id: campagne.id,
      annee: campagne.annee,
      dateDebut: campagne.dateDebut.toISOString(),
      dateFin: campagne.dateFin.toISOString(),
      statut: campagne.campagneRegionStatut ?? campagne.statut,
      hasCampagneRegionEnCours: campagne.campagneRegionStatut === CampagneStatutEnum["en cours"],
      codeRegion: campagne.codeRegion,
      withSaisiePerdir: campagne.withSaisiePerdir,
      dateVote: campagne.dateVote?.toISOString(),
    })
    ));

