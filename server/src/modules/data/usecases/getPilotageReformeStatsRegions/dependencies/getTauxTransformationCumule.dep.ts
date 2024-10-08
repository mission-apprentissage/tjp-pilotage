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
      sb.fn.sum<number>("constatRentree.effectif").as("effectif"),
      sb.ref("region.codeRegion").as("codeRegion"),
    ])
    .$call((eb) => {
      if (filters.codeNiveauDiplome)
        return eb.where("codeNiveauDiplome", "in", filters.codeNiveauDiplome);
      return eb;
    })
    .$call((eb) => {
      if (filters.codeRegion) {
        return eb.where("codeRegion", "=", filters.codeRegion);
      }
      return eb;
    })
    .groupBy("region.codeRegion")
    .execute()
    .then(cleanNull);

const getSumPlacesTransformeeValidee = async (filters: {
  codeNiveauDiplome?: string[];
  codeRegion?: string;
}) =>
  kdb
    .selectFrom("latestDemandeIntentionView as demande")
    .leftJoin("campagne", "campagne.id", "demande.campagneId")
    .leftJoin("region", "region.codeRegion", "demande.codeRegion")
    .where("demande.statut", "=", DemandeStatutEnum["demande validée"])
    .select((sb) => [
      sb.ref("region.codeRegion").as("codeRegion"),
      sb.fn
        .coalesce(
          sb.fn.sum<number>(countPlacesTransformeesParCampagne(sb)),
          sb.val(0)
        )
        .as("nbPlacesTransformees"),
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
        return eb.where("codeRegion", "=", filters.codeRegion);
      }
      return eb;
    })
    .groupBy("region.codeRegion")
    .execute()
    .then(cleanNull);

export const getTauxTransfoCumuleParRegion = async (filters: {
  codeNiveauDiplome?: string[];
  codeRegion?: string;
}) => {
  const [effectifsRS2022, placesTransformee] = await Promise.all([
    getSumEffectifForRentreeScolaire2022(filters),
    getSumPlacesTransformeeValidee(filters),
  ]);

  return effectifsRS2022
    .map(({ effectif, codeRegion }) => ({
      effectif,
      codeRegion,
      placesTransformee: placesTransformee.find(
        (pt) => pt.codeRegion === codeRegion
      )?.nbPlacesTransformees,
    }))
    .map(({ codeRegion, effectif, placesTransformee }) => ({
      codeRegion,
      tauxTransformation: formatTauxTransformation(
        placesTransformee ?? 0,
        effectif
      ),
    }));
};
