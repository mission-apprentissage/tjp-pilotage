import { sql } from "kysely";
import { DemandeStatutEnum } from "shared/enum/demandeStatutEnum";

import { kdb } from "../../../../../db/db";
import { cleanNull } from "../../../../../utils/noNull";
import { countPlacesTransformeesParCampagne } from "../../../../utils/countCapacite";
import { formatTauxTransformation } from "../../../utils/formatTauxTransformation";
import { isInPerimetreIJRegion } from "../../../utils/isInPerimetreIJ";

const getSumEffectifForRentreeScolaire2022 = async (filters: {
  codeNiveauDiplome?: string[];
  codeRegion?: string;
}) =>
  kdb
    .with("effectif_rs_2022", (db) =>
      db
        .selectFrom("constatRentree")
        .leftJoin("dataFormation", "dataFormation.cfd", "constatRentree.cfd")
        .leftJoin(
          "dataEtablissement",
          "dataEtablissement.uai",
          "constatRentree.uai"
        )
        .leftJoin("region", "region.codeRegion", "dataEtablissement.codeRegion")
        .where("constatRentree.rentreeScolaire", "=", "2022")
        .where(isInPerimetreIJRegion)
        .where((wb) =>
          wb
            .case()
            .when("dataFormation.typeFamille", "in", ["specialite", "option"])
            .then(wb("constatRentree.anneeDispositif", "=", 2))
            .when("dataFormation.typeFamille", "in", [
              "2nde_commune",
              "1ere_commune",
            ])
            .then(false)
            .else(wb("constatRentree.anneeDispositif", "=", 1))
            .end()
        )
        .select((sb) => [
          sb.ref("constatRentree.effectif").as("effectif"),
          sb.ref("region.codeRegion").as("codeRegion"),
          sb.ref("dataFormation.typeFamille").as("typeFamille"),
          sb.ref("dataFormation.codeNiveauDiplome").as("codeNiveauDiplome"),
        ])
        .$call((eb) => {
          if (filters.codeNiveauDiplome)
            return eb.where(
              "codeNiveauDiplome",
              "in",
              filters.codeNiveauDiplome
            );
          return eb;
        })
        .$call((eb) => {
          if (filters.codeRegion) {
            return eb.where("region.codeRegion", "=", filters.codeRegion);
          }
          return eb;
        })
    )
    .selectFrom("effectif_rs_2022")
    .select(({ fn }) => [
      fn.sum<number>("effectif_rs_2022.effectif").as("effectif"),
    ])
    .executeTakeFirst()
    .then(cleanNull);

const getSumPlacesTransformeeValidee = async (filters: {
  codeNiveauDiplome?: string[];
  codeRegion?: string;
}) =>
  kdb
    .with("liste_places_transformee", (db) =>
      db
        .selectFrom("latestDemandeIntentionView as demande")
        .leftJoin("campagne", "campagne.id", "demande.campagneId")
        .leftJoin("region", "region.codeRegion", "demande.codeRegion")
        .where("demande.statut", "=", DemandeStatutEnum["demande validée"])
        .select((sb) => [
          sb.ref("region.codeRegion").as("codeRegion"),
          sql`LEFT(${sb.ref("demande.cfd")}, 3)`.as("codeNiveauDiplome"),
          countPlacesTransformeesParCampagne(sb).as("nb places transformees"),
        ])
        .$call((eb) => {
          if (filters.codeNiveauDiplome)
            return eb.where(
              (wb) => sql`LEFT(${wb.ref("demande.cfd")}, 3)`,
              "in",
              filters.codeNiveauDiplome
            );
          return eb;
        })
        .$call((eb) => {
          if (filters.codeRegion) {
            return eb.where("region.codeRegion", "=", filters.codeRegion);
          }
          return eb;
        })
    )
    .selectFrom("liste_places_transformee")
    .select((sb) => [
      sb.fn
        .coalesce(
          sb.fn.sum<number>("liste_places_transformee.nb places transformees"),
          sb.val(0)
        )
        .as("sumNbPlacesTransformees"),
    ])

    .executeTakeFirst()
    .then(cleanNull);

export const getTauxTransformationCumule = async (filters: {
  codeNiveauDiplome?: string[];
  codeRegion?: string;
}) => {
  const [effectifsRS2022, placesTransformee] = await Promise.all([
    getSumEffectifForRentreeScolaire2022(filters),
    getSumPlacesTransformeeValidee(filters),
  ]);

  return formatTauxTransformation(
    placesTransformee?.sumNbPlacesTransformees ?? 0,
    effectifsRS2022?.effectif
  );
};
