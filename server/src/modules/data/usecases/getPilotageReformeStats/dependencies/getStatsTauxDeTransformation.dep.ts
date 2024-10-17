import { sql } from "kysely";
import { DemandeStatutEnum } from "shared/enum/demandeStatutEnum";
import { z } from "zod";

import { kdb } from "../../../../../db/db";
import { cleanNull } from "../../../../../utils/noNull";
import { countPlacesTransformeesParCampagne } from "../../../../utils/countCapacite";
import { formatTauxTransformation } from "../../../utils/formatTauxTransformation";
import { isInPerimetreIJRegion } from "../../../utils/isInPerimetreIJ";
import { StatsTauxDeTransformationSchema } from "../getPilotageReformeStats.schema";

const getCampagnesAnnees = kdb
  .selectFrom("campagne")
  .select(["campagne.annee"])
  .distinct()
  .execute();

const getSumEffectifForRentreeScolaire2022 = async ({
  codeRegion,
  codeNiveauDiplome,
}: {
  codeRegion?: string;
  codeNiveauDiplome?: string[];
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
          if (codeNiveauDiplome)
            return eb.where("codeNiveauDiplome", "in", codeNiveauDiplome);
          return eb;
        })
        .$call((eb) => {
          if (codeRegion) {
            return eb.where("region.codeRegion", "=", codeRegion);
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

const getSumPlacesTransformeeValidee = async ({
  codeRegion,
  codeNiveauDiplome,
}: {
  codeRegion?: string;
  codeNiveauDiplome?: string[];
}) =>
  kdb
    .with("liste_places_transformee", (db) =>
      db
        .selectFrom("latestDemandeIntentionView as demande")
        .leftJoin("campagne", "campagne.id", "demande.campagneId")
        .leftJoin("region", "region.codeRegion", "demande.codeRegion")
        .where("demande.statut", "=", DemandeStatutEnum["demande validée"])
        .select((sb) => [
          sb.ref("campagne.annee").as("annee"),
          sb.ref("region.codeRegion").as("codeRegion"),
          sql`LEFT(${sb.ref("demande.cfd")}, 3)`.as("codeNiveauDiplome"),
          countPlacesTransformeesParCampagne(sb).as("nb places transformees"),
        ])
        .$call((eb) => {
          if (codeNiveauDiplome)
            return eb.where(
              (wb) => sql`LEFT(${wb.ref("demande.cfd")}, 3)`,
              "in",
              codeNiveauDiplome
            );
          return eb;
        })
        .$call((eb) => {
          if (codeRegion) {
            return eb.where("region.codeRegion", "=", codeRegion);
          }
          return eb;
        })
    )
    .selectFrom("liste_places_transformee")
    .select((sb) => [
      sb.ref("annee").as("annee"),
      sb.fn
        .coalesce(
          sb.fn.sum<number>("liste_places_transformee.nb places transformees"),
          sb.val(0)
        )
        .as("sumNbPlacesTransformees"),
    ])
    .groupBy(["annee"])
    .execute()
    .then(cleanNull);

type StatsTauxDeTransformation = z.infer<
  typeof StatsTauxDeTransformationSchema
>;

export const getStatsTauxDeTransformation = async ({
  codeRegion,
  codeNiveauDiplome,
}: {
  codeRegion?: string;
  codeNiveauDiplome?: string[];
}) => {
  const [
    campagneAnnees,
    effectifNational,
    placesTransformeeNational,
    effectifRegion,
    placesTransformeeRegion,
  ] = await Promise.all([
    getCampagnesAnnees,
    getSumEffectifForRentreeScolaire2022({ codeNiveauDiplome }),
    getSumPlacesTransformeeValidee({ codeNiveauDiplome }),
    getSumEffectifForRentreeScolaire2022({ codeNiveauDiplome, codeRegion }),
    getSumPlacesTransformeeValidee({ codeNiveauDiplome, codeRegion }),
  ]);

  return campagneAnnees.reduce((prev, curr) => {
    prev[curr.annee] = {
      annee: curr.annee,
      libelleAnnee: curr.annee,
      filtered:
        (formatTauxTransformation(
          placesTransformeeRegion.find((p) => p.annee === curr.annee)
            ?.sumNbPlacesTransformees ?? 0,
          effectifRegion?.effectif
        ) ?? 0) * 100,
      nationale:
        (formatTauxTransformation(
          placesTransformeeNational.find((p) => p.annee === curr.annee)
            ?.sumNbPlacesTransformees ?? 0,
          effectifNational?.effectif
        ) ?? 0) * 100,
    };

    return prev;
  }, {} as StatsTauxDeTransformation);
};
