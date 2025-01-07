import { sql } from "kysely";
import { ScopeEnum } from "shared";
import type { getStatsPilotageIntentionsSchema } from "shared/routes/schemas/get.pilotage-intentions.stats.schema";
import type { z } from "zod";

import { getKbdClient } from "@/db/db";
import {
  isInPerimetreIJAcademie,
  isInPerimetreIJDepartement,
  isInPerimetreIJRegion,
} from "@/modules/data/utils/isInPerimetreIJ";
import { genericOnConstatRentree } from "@/modules/data/utils/onConstatDeRentree";
import { genericOnDemandes } from "@/modules/data/utils/onDemande";
import { cleanNull } from "@/utils/noNull";

export interface Filters extends z.infer<typeof getStatsPilotageIntentionsSchema.querystring> {
  campagne: string;
}

const getNationalData = async (filters: Filters) => {
  return getKbdClient()
    .selectFrom(genericOnDemandes(filters).as("demandes"))
    .leftJoin(
      genericOnConstatRentree(filters)
        .select((eb) => [sql<number>`SUM(${eb.ref("constatRentree.effectif")})`.as("effectif")])
        .as("effectifs"),
      (join) => join.onTrue()
    )
    .select((eb) => [
      eb.fn.coalesce("countDemande", eb.val(0)).as("countDemande"),
      eb.fn.coalesce("placesOuvertesScolaire", eb.val(0)).as("placesOuvertesScolaire"),
      eb.fn.coalesce("placesFermeesScolaire", eb.val(0)).as("placesFermeesScolaire"),
      eb.fn.coalesce("placesOuvertesScolaireQ1", eb.val(0)).as("placesOuvertesScolaireQ1"),
      eb.fn.coalesce("placesFermeesScolaireQ4", eb.val(0)).as("placesFermeesScolaireQ4"),
      eb.fn.coalesce("placesOuvertesApprentissage", eb.val(0)).as("placesOuvertesApprentissage"),
      eb.fn.coalesce("placesFermeesApprentissage", eb.val(0)).as("placesFermeesApprentissage"),
      eb.fn.coalesce("placesOuvertesApprentissageQ1", eb.val(0)).as("placesOuvertesApprentissageQ1"),
      eb.fn.coalesce("placesFermeesApprentissageQ4", eb.val(0)).as("placesFermeesApprentissageQ4"),
      eb.fn.coalesce("placesOuvertes", eb.val(0)).as("placesOuvertes"),
      eb.fn.coalesce("placesFermees", eb.val(0)).as("placesFermees"),
      eb.fn.coalesce("placesOuvertesQ1", eb.val(0)).as("placesOuvertesQ1"),
      eb.fn.coalesce("placesFermeesQ4", eb.val(0)).as("placesFermeesQ4"),
      eb.fn.coalesce("placesOuvertesTransformationEcologique", eb.val(0)).as("placesOuvertesTransformationEcologique"),
      eb.fn.coalesce("placesNonColoreesTransformees", eb.val(0)).as("placesNonColoreesTransformees"),
      eb.fn.coalesce("placesColoreesOuvertes", eb.val(0)).as("placesColoreesOuvertes"),
      eb.fn.coalesce("placesColoreesFermees", eb.val(0)).as("placesColoreesFermees"),
      eb.fn.coalesce("placesColorees", eb.val(0)).as("placesColorees"),
      eb.fn.coalesce("placesColoreesQ4", eb.val(0)).as("placesColoreesQ4"),
      eb.fn.coalesce("placesTransformees", eb.val(0)).as("placesTransformees"),
      eb.fn.coalesce("effectifs.effectif", eb.val(0)).as("effectif"),
      eb.val("national").as("code"),
      eb.val("national").as("libelle"),
    ])
    .execute()
    .then(cleanNull);
};

const getRegionData = async (filters: Filters) => {
  return getKbdClient()
    .selectFrom("region")
    .leftJoin(
      genericOnDemandes(filters)
        .select((eb) => [eb.ref("demande.codeRegion").as("codeRegion")])
        .groupBy(["demande.codeRegion"])
        .as("demandes"),
      (join) => join.onRef("demandes.codeRegion", "=", "region.codeRegion")
    )
    .leftJoin(
      genericOnConstatRentree(filters)
        .select((eb) => [
          eb.ref("dataEtablissement.codeRegion").as("codeRegion"),
          sql<number>`SUM(${eb.ref("constatRentree.effectif")})`.as("effectif"),
        ])
        .groupBy(["dataEtablissement.codeRegion"])
        .as("effectifs"),
      (join) => join.onRef("effectifs.codeRegion", "=", "region.codeRegion")
    )
    .select((eb) => [
      eb.fn.coalesce("countDemande", eb.val(0)).as("countDemande"),
      eb.fn.coalesce("placesOuvertesScolaire", eb.val(0)).as("placesOuvertesScolaire"),
      eb.fn.coalesce("placesFermeesScolaire", eb.val(0)).as("placesFermeesScolaire"),
      eb.fn.coalesce("placesOuvertesScolaireQ1", eb.val(0)).as("placesOuvertesScolaireQ1"),
      eb.fn.coalesce("placesFermeesScolaireQ4", eb.val(0)).as("placesFermeesScolaireQ4"),
      eb.fn.coalesce("placesOuvertesApprentissage", eb.val(0)).as("placesOuvertesApprentissage"),
      eb.fn.coalesce("placesFermeesApprentissage", eb.val(0)).as("placesFermeesApprentissage"),
      eb.fn.coalesce("placesOuvertesApprentissageQ1", eb.val(0)).as("placesOuvertesApprentissageQ1"),
      eb.fn.coalesce("placesFermeesApprentissageQ4", eb.val(0)).as("placesFermeesApprentissageQ4"),
      eb.fn.coalesce("placesOuvertes", eb.val(0)).as("placesOuvertes"),
      eb.fn.coalesce("placesFermees", eb.val(0)).as("placesFermees"),
      eb.fn.coalesce("placesOuvertesQ1", eb.val(0)).as("placesOuvertesQ1"),
      eb.fn.coalesce("placesFermeesQ4", eb.val(0)).as("placesFermeesQ4"),
      eb.fn.coalesce("placesOuvertesTransformationEcologique", eb.val(0)).as("placesOuvertesTransformationEcologique"),
      eb.fn.coalesce("placesNonColoreesTransformees", eb.val(0)).as("placesNonColoreesTransformees"),
      eb.fn.coalesce("placesColoreesOuvertes", eb.val(0)).as("placesColoreesOuvertes"),
      eb.fn.coalesce("placesColoreesFermees", eb.val(0)).as("placesColoreesFermees"),
      eb.fn.coalesce("placesColorees", eb.val(0)).as("placesColorees"),
      eb.fn.coalesce("placesColoreesQ4", eb.val(0)).as("placesColoreesQ4"),
      eb.fn.coalesce("placesTransformees", eb.val(0)).as("placesTransformees"),
      eb.fn.coalesce("effectifs.effectif", eb.val(0)).as("effectif"),
      "region.codeRegion as code",
      "region.libelleRegion as libelle",
    ])
    .where(isInPerimetreIJRegion)
    .execute()
    .then(cleanNull);
};

const getAcademieData = async (filters: Filters) => {
  return getKbdClient()
    .selectFrom("academie")
    .leftJoin(
      genericOnDemandes(filters)
        .select((eb) => [eb.ref("demande.codeAcademie").as("codeAcademie")])
        .groupBy(["demande.codeAcademie"])
        .as("demandes"),
      (join) => join.onRef("demandes.codeAcademie", "=", "academie.codeAcademie")
    )
    .leftJoin(
      genericOnConstatRentree(filters)
        .select((eb) => [
          eb.ref("dataEtablissement.codeAcademie").as("codeAcademie"),
          sql<number>`SUM(${eb.ref("constatRentree.effectif")})`.as("effectif"),
        ])
        .groupBy(["dataEtablissement.codeAcademie"])
        .as("effectifs"),
      (join) => join.onRef("effectifs.codeAcademie", "=", "academie.codeAcademie")
    )
    .select((eb) => [
      eb.fn.coalesce("countDemande", eb.val(0)).as("countDemande"),
      eb.fn.coalesce("placesOuvertesScolaire", eb.val(0)).as("placesOuvertesScolaire"),
      eb.fn.coalesce("placesFermeesScolaire", eb.val(0)).as("placesFermeesScolaire"),
      eb.fn.coalesce("placesOuvertesScolaireQ1", eb.val(0)).as("placesOuvertesScolaireQ1"),
      eb.fn.coalesce("placesFermeesScolaireQ4", eb.val(0)).as("placesFermeesScolaireQ4"),
      eb.fn.coalesce("placesOuvertesApprentissage", eb.val(0)).as("placesOuvertesApprentissage"),
      eb.fn.coalesce("placesFermeesApprentissage", eb.val(0)).as("placesFermeesApprentissage"),
      eb.fn.coalesce("placesOuvertesApprentissageQ1", eb.val(0)).as("placesOuvertesApprentissageQ1"),
      eb.fn.coalesce("placesFermeesApprentissageQ4", eb.val(0)).as("placesFermeesApprentissageQ4"),
      eb.fn.coalesce("placesOuvertes", eb.val(0)).as("placesOuvertes"),
      eb.fn.coalesce("placesFermees", eb.val(0)).as("placesFermees"),
      eb.fn.coalesce("placesOuvertesQ1", eb.val(0)).as("placesOuvertesQ1"),
      eb.fn.coalesce("placesFermeesQ4", eb.val(0)).as("placesFermeesQ4"),
      eb.fn.coalesce("placesOuvertesTransformationEcologique", eb.val(0)).as("placesOuvertesTransformationEcologique"),
      eb.fn.coalesce("placesNonColoreesTransformees", eb.val(0)).as("placesNonColoreesTransformees"),
      eb.fn.coalesce("placesColoreesOuvertes", eb.val(0)).as("placesColoreesOuvertes"),
      eb.fn.coalesce("placesColoreesFermees", eb.val(0)).as("placesColoreesFermees"),
      eb.fn.coalesce("placesColorees", eb.val(0)).as("placesColorees"),
      eb.fn.coalesce("placesColoreesQ4", eb.val(0)).as("placesColoreesQ4"),
      eb.fn.coalesce("placesTransformees", eb.val(0)).as("placesTransformees"),
      eb.fn.coalesce("effectifs.effectif", eb.val(0)).as("effectif"),
      "academie.codeAcademie as code",
      "academie.libelleAcademie as libelle",
    ])
    .where(isInPerimetreIJAcademie)
    .execute()
    .then(cleanNull);
};

const getDepartementData = async (filters: Filters) => {
  return getKbdClient()
    .selectFrom("departement")
    .leftJoin(
      genericOnDemandes(filters)
        .select((eb) => [eb.ref("dataEtablissement.codeDepartement").as("codeDepartement")])
        .groupBy(["dataEtablissement.codeDepartement"])
        .as("demandes"),
      (join) => join.onRef("demandes.codeDepartement", "=", "departement.codeDepartement")
    )
    .leftJoin(
      genericOnConstatRentree(filters)
        .select((eb) => [
          eb.ref("dataEtablissement.codeDepartement").as("codeDepartement"),
          sql<number>`SUM(${eb.ref("constatRentree.effectif")})`.as("effectif"),
        ])
        .groupBy(["dataEtablissement.codeDepartement"])
        .as("effectifs"),
      (join) => join.onRef("effectifs.codeDepartement", "=", "departement.codeDepartement")
    )
    .leftJoin("academie", "academie.codeAcademie", "departement.codeAcademie")
    .select((eb) => [
      eb.fn.coalesce("countDemande", eb.val(0)).as("countDemande"),
      eb.fn.coalesce("placesOuvertesScolaire", eb.val(0)).as("placesOuvertesScolaire"),
      eb.fn.coalesce("placesFermeesScolaire", eb.val(0)).as("placesFermeesScolaire"),
      eb.fn.coalesce("placesOuvertesScolaireQ1", eb.val(0)).as("placesOuvertesScolaireQ1"),
      eb.fn.coalesce("placesFermeesScolaireQ4", eb.val(0)).as("placesFermeesScolaireQ4"),
      eb.fn.coalesce("placesOuvertesApprentissage", eb.val(0)).as("placesOuvertesApprentissage"),
      eb.fn.coalesce("placesFermeesApprentissage", eb.val(0)).as("placesFermeesApprentissage"),
      eb.fn.coalesce("placesOuvertesApprentissageQ1", eb.val(0)).as("placesOuvertesApprentissageQ1"),
      eb.fn.coalesce("placesFermeesApprentissageQ4", eb.val(0)).as("placesFermeesApprentissageQ4"),
      eb.fn.coalesce("placesOuvertes", eb.val(0)).as("placesOuvertes"),
      eb.fn.coalesce("placesFermees", eb.val(0)).as("placesFermees"),
      eb.fn.coalesce("placesOuvertesQ1", eb.val(0)).as("placesOuvertesQ1"),
      eb.fn.coalesce("placesFermeesQ4", eb.val(0)).as("placesFermeesQ4"),
      eb.fn.coalesce("placesOuvertesTransformationEcologique", eb.val(0)).as("placesOuvertesTransformationEcologique"),
      eb.fn.coalesce("placesNonColoreesTransformees", eb.val(0)).as("placesNonColoreesTransformees"),
      eb.fn.coalesce("placesColoreesOuvertes", eb.val(0)).as("placesColoreesOuvertes"),
      eb.fn.coalesce("placesColoreesFermees", eb.val(0)).as("placesColoreesFermees"),
      eb.fn.coalesce("placesColorees", eb.val(0)).as("placesColorees"),
      eb.fn.coalesce("placesColoreesQ4", eb.val(0)).as("placesColoreesQ4"),
      eb.fn.coalesce("placesTransformees", eb.val(0)).as("placesTransformees"),
      eb.fn.coalesce("effectifs.effectif", eb.val(0)).as("effectif"),
      "departement.codeDepartement as code",
      "departement.libelleDepartement as libelle",
      "academie.libelleAcademie as libelleAcademie",
    ])
    .where(isInPerimetreIJDepartement)
    .execute()
    .then(cleanNull);
};

export const getStatsPilotageIntentionsQuery = async ({
  statut,
  rentreeScolaire,
  codeNiveauDiplome,
  CPC,
  codeNsf,
  scope,
  campagne,
  secteur,
  withColoration,
  formationSpecifique,
}: Filters) => {
  switch (scope) {
  case ScopeEnum["académie"]:
    return getAcademieData({
      statut,
      rentreeScolaire,
      codeNiveauDiplome,
      CPC,
      codeNsf,
      campagne,
      scope,
      secteur,
      withColoration,
      formationSpecifique,
    });

  case ScopeEnum["département"]:
    return getDepartementData({
      statut,
      rentreeScolaire,
      codeNiveauDiplome,
      CPC,
      codeNsf,
      campagne,
      scope,
      secteur,
      withColoration,
      formationSpecifique,
    });
  case ScopeEnum["région"]:
    return getRegionData({
      statut,
      rentreeScolaire,
      codeNiveauDiplome,
      CPC,
      codeNsf,
      campagne,
      scope,
      secteur,
      withColoration,
      formationSpecifique,
    });
  case ScopeEnum.national:
  default:
    return getNationalData({
      statut,
      rentreeScolaire,
      codeNiveauDiplome,
      CPC,
      codeNsf,
      campagne,
      scope,
      secteur,
      withColoration,
      formationSpecifique,
    });
  }
};
