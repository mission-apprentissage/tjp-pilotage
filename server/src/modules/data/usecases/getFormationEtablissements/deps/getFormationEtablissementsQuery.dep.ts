import { sql } from "kysely";
import { jsonArrayFrom, jsonBuildObject } from 'kysely/helpers/postgres';
import { CURRENT_RENTREE, VoieEnum } from "shared";
import { DemandeTypeEnum } from "shared/enum/demandeTypeEnum";
import { TypeFormationSpecifiqueEnum } from "shared/enum/formationSpecifiqueEnum";
import { PositionQuadrantEnum } from "shared/enum/positionQuadrantEnum";
import type { TypeFamille } from "shared/enum/typeFamilleEnum";
import { TypeFamilleEnum } from "shared/enum/typeFamilleEnum";
import { getMillesimeFromRentreeScolaire } from "shared/utils/getMillesime";
import { MAX_LIMIT } from "shared/utils/maxLimit";

import { getKbdClient } from "@/db/db";
import type { Filters } from "@/modules/data/usecases/getFormationEtablissements/getFormationEtablissements.usecase";
import { capaciteAnnee } from "@/modules/data/utils/capaciteAnnee";
import { effectifAnnee } from "@/modules/data/utils/effectifAnnee";
import { isInPerimetreIJEtablissement } from "@/modules/data/utils/isInPerimetreIJ";
import { isScolaireFormationHistorique } from "@/modules/data/utils/isScolaire";
import { notAnneeCommune } from "@/modules/data/utils/notAnneeCommune";
import { isHistoriqueCoExistant, notHistoriqueUnlessCoExistant } from "@/modules/data/utils/notHistorique";
import { premiersVoeuxAnnee } from "@/modules/data/utils/premiersVoeuxAnnee";
import { selectTauxDemande, selectTauxDemandeAgg } from "@/modules/data/utils/tauxDemande";
import { selectTauxDevenirFavorable, selectTauxDevenirFavorableAgg } from "@/modules/data/utils/tauxDevenirFavorable";
import { selectTauxInsertion6mois, selectTauxInsertion6moisAgg } from "@/modules/data/utils/tauxInsertion6mois";
import { selectTauxPoursuite, selectTauxPoursuiteAgg } from "@/modules/data/utils/tauxPoursuite";
import { selectTauxPression, selectTauxPressionAgg } from "@/modules/data/utils/tauxPression";
import { selectTauxRemplissage, selectTauxRemplissageAgg } from "@/modules/data/utils/tauxRemplissage";
import { formatFormationSpecifique } from "@/modules/utils/formatFormationSpecifique";
import { isFormationActionPrioritaire } from "@/modules/utils/isFormationActionPrioritaire";
import { isFormationRenovee } from "@/modules/utils/isFormationRenovee";
import { getNormalizedSearchArray } from "@/modules/utils/searchHelpers";
import { cleanNull } from "@/utils/noNull";


export const getFormationEtablissementsQuery = async ({
  offset = 0,
  limit = MAX_LIMIT,
  rentreeScolaire = CURRENT_RENTREE,
  codeRegion,
  codeAcademie,
  codeDepartement,
  codeNiveauDiplome,
  codeDispositif,
  commune,
  cfd,
  cfdFamille,
  uai,
  secteur,
  codeNsf,
  positionQuadrant,
  withAnneeCommune,
  formationSpecifique,
  dateEffetTransformation,
  typeDemande,
  search,
  order,
  orderBy,
  user
}: Partial<Filters>) => {
  const search_array = getNormalizedSearchArray(search);
  const millesimeSortie = getMillesimeFromRentreeScolaire({ rentreeScolaire });

  const result = await getKbdClient()
    .selectFrom("formationScolaireView as formationView")
    .innerJoin("formationEtablissement", (join) =>
      join
        .onRef("formationEtablissement.cfd", "=", "formationView.cfd")
        .onRef("formationEtablissement.voie", "=", "formationView.voie")
    )
    .innerJoin("dataFormation", "dataFormation.cfd", "formationView.cfd")
    .leftJoin("dispositif", "dispositif.codeDispositif", "formationEtablissement.codeDispositif")
    .leftJoin("familleMetier", "familleMetier.cfd", "formationView.cfd")
    .leftJoin("niveauDiplome", "niveauDiplome.codeNiveauDiplome", "formationView.codeNiveauDiplome")
    .innerJoin("indicateurEntree", (join) =>
      join
        .onRef("formationEtablissement.id", "=", "indicateurEntree.formationEtablissementId")
        .on("indicateurEntree.rentreeScolaire", "=", rentreeScolaire)
    )
    .innerJoin("etablissement", "etablissement.uai", "formationEtablissement.uai")
    .leftJoin("indicateurSortie", (join) =>
      join
        .onRef("indicateurSortie.formationEtablissementId", "=", "formationEtablissement.id")
        .on("indicateurSortie.millesimeSortie", "=", millesimeSortie)
    )
    .leftJoin("indicateurRegionSortie", (join) =>
      join
        .onRef("indicateurRegionSortie.cfd", "=", "formationView.cfd")
        .onRef("indicateurRegionSortie.codeDispositif", "=", "formationEtablissement.codeDispositif")
        .onRef("indicateurRegionSortie.codeRegion", "=", "etablissement.codeRegion")
        .on("indicateurRegionSortie.voie", "=", VoieEnum["scolaire"])
        .on("indicateurRegionSortie.millesimeSortie", "=", millesimeSortie)
    )
    .leftJoin("indicateurEtablissement", (join) =>
      join
        .onRef("etablissement.uai", "=", "indicateurEtablissement.uai")
        .on("indicateurEtablissement.millesime", "=", millesimeSortie)
    )
    .leftJoin("departement", "departement.codeDepartement", "etablissement.codeDepartement")
    .leftJoin("academie", "academie.codeAcademie", "etablissement.codeAcademie")
    .leftJoin("region", "region.codeRegion", "etablissement.codeRegion")
    .leftJoin("dataFormation as formationContinuum", "formationContinuum.cfd", "indicateurRegionSortie.cfdContinuum")
    .leftJoin("formationHistorique", (join) =>
      join
        .onRef("formationHistorique.ancienCFD", "=", "formationView.cfd")
        .on(isScolaireFormationHistorique)
    )
    .leftJoin("nsf", "nsf.codeNsf", "formationView.codeNsf")
    .leftJoin("positionFormationRegionaleQuadrant", (join) =>
      join.on((eb) =>
        eb.and([
          eb(eb.ref("positionFormationRegionaleQuadrant.cfd"), "=", eb.ref("formationEtablissement.cfd")),
          eb(
            eb.ref("positionFormationRegionaleQuadrant.codeDispositif"),
            "=",
            eb.ref("formationEtablissement.codeDispositif")
          ),
          eb(
            eb.ref("positionFormationRegionaleQuadrant.codeNiveauDiplome"),
            "=",
            eb.ref("formationView.codeNiveauDiplome")
          ),
          eb(eb.ref("positionFormationRegionaleQuadrant.codeRegion"), "=", eb.ref("etablissement.codeRegion")),
          eb(eb.ref("positionFormationRegionaleQuadrant.millesimeSortie"), "=", millesimeSortie),
        ])
      )
    )
    .leftJoin("actionPrioritaire", (join) =>
      join
        .onRef("actionPrioritaire.cfd", "=", "formationEtablissement.cfd")
        .onRef("actionPrioritaire.codeDispositif", "=", "formationEtablissement.codeDispositif")
        .onRef("actionPrioritaire.codeRegion", "=", "etablissement.codeRegion")
    )
    .$if(!!user, (eb) =>
      eb
        .leftJoin("demandeConstatView as demandeConstat", (join) =>
          join
            .onRef("demandeConstat.cfd", "=", "formationEtablissement.cfd")
            .onRef("demandeConstat.codeDispositif", "=", "formationEtablissement.codeDispositif")
            .onRef("demandeConstat.uai", "=", "formationEtablissement.uai")
            .on("demandeConstat.rentreeScolaire", ">=", parseInt(rentreeScolaire))
            .on((eb) =>
              eb.or([
                eb(sql<number>`
                  abs(${eb.ref("demandeConstat.differenceCapaciteScolaire")}) +
                  abs(${eb.ref("demandeConstat.differenceCapaciteApprentissage")})
                `, ">", 1),
                eb(sql<number>`
                  abs(${eb.ref("demandeConstat.differenceCapaciteScolaireColoree")}) +
                  abs(${eb.ref("demandeConstat.differenceCapaciteApprentissageColoree")})
                `, ">", 1),
              ])
            )
        )
        .select([
          sql<string>`string_agg("demandeConstat"."numero", ', ' ORDER BY "demandeConstat"."rentreeScolaire")`.as("numero"),
          sql<string>`string_agg("demandeConstat"."typeDemande", ', ' ORDER BY "demandeConstat"."rentreeScolaire")`.as("typeDemande"),
          sql<string>`string_agg(("demandeConstat"."rentreeScolaire"::varchar), ', ' ORDER BY "demandeConstat"."rentreeScolaire")`.as("dateEffetTransformation"),
          sql<string>`string_agg("demandeConstat"."annee", ', ' ORDER BY "demandeConstat"."rentreeScolaire")`.as("anneeCampagne"),
          sql<string>`
            string_agg(
              ("demandeConstat"."differenceCapaciteScolaire"::varchar), ', ' ORDER BY "demandeConstat"."rentreeScolaire"
            )
          `.as("differenceCapaciteScolaire"),
          sql<string>`
            string_agg(
              ("demandeConstat"."differenceCapaciteApprentissage"::varchar), ', ' ORDER BY "demandeConstat"."rentreeScolaire"
            )
          `.as("differenceCapaciteApprentissage"),
        ])
        .$call((q) => {
          if (!dateEffetTransformation) return q;
          return q.where((eb) => eb.or(
            dateEffetTransformation.map((rs) =>
              eb("demandeConstat.rentreeScolaire", "=", parseInt(rs))
            )
          ));
        })
        .$call((q) => {
          if (!typeDemande) return q;
          return q.where((eb) => eb.or(
            typeDemande.map((type) => {
              if(type === DemandeTypeEnum["augmentation_compensation"] || type === DemandeTypeEnum["augmentation_nette"])
                return eb("demandeConstat.typeDemande", "in", [
                  DemandeTypeEnum["augmentation_compensation"],
                  DemandeTypeEnum["augmentation_nette"]
                ]);
              if(type === DemandeTypeEnum["ouverture_compensation"] || type === DemandeTypeEnum["ouverture_nette"])
                return eb("demandeConstat.typeDemande", "in", [
                  DemandeTypeEnum["ouverture_compensation"],
                  DemandeTypeEnum["ouverture_nette"]
                ]);
              return eb("demandeConstat.typeDemande", "=", type);
            }
            )
          ));
        })
    )
    .select((eb) => [
      sql<number>`COUNT(*) OVER()`.as("count"),
      "etablissement.libelleEtablissement",
      "etablissement.secteur",
      "etablissement.commune",
      "formationView.cfd",
      "formationView.libelleFormation",
      "formationView.codeNiveauDiplome",
      "formationView.cpc",
      "formationView.cpcSecteur",
      "nsf.libelleNsf",
      "departement.libelleDepartement",
      "departement.codeDepartement",
      "academie.libelleAcademie",
      "academie.codeAcademie",
      "region.libelleRegion",
      "etablissement.codeRegion",
      "etablissement.uai",
      "formationView.typeFamille",
      "familleMetier.libelleFamille",
      "dispositif.libelleDispositif",
      "formationEtablissement.codeDispositif",
      "niveauDiplome.libelleNiveauDiplome",
      "indicateurEntree.rentreeScolaire",
      "indicateurEtablissement.valeurAjoutee",
      "indicateurEntree.anneeDebut",
      sql<string>`string_agg("formationHistorique"."cfd", ', ')`.as("formationRenovee"),
      selectTauxRemplissage("indicateurEntree").as("tauxRemplissage"),
      effectifAnnee({ alias: "indicateurEntree" }).as("effectifEntree"),
      effectifAnnee({ alias: "indicateurEntree", annee: sql`'0'` }).as("effectif1"),
      effectifAnnee({ alias: "indicateurEntree", annee: sql`'1'` }).as("effectif2"),
      effectifAnnee({ alias: "indicateurEntree", annee: sql`'2'` }).as("effectif3"),
      capaciteAnnee({ alias: "indicateurEntree" }).as("capacite"),
      capaciteAnnee({ alias: "indicateurEntree", annee: sql`'0'` }).as("capacite1"),
      capaciteAnnee({ alias: "indicateurEntree", annee: sql`'1'` }).as("capacite2"),
      capaciteAnnee({ alias: "indicateurEntree", annee: sql`'2'` }).as("capacite3"),
      premiersVoeuxAnnee({ alias: "indicateurEntree" }).as("premiersVoeux"),
      selectTauxPression("indicateurEntree", "formationView", false).as("tauxPression"),
      selectTauxDemande("indicateurEntree", "formationView").as("tauxDemande"),
      selectTauxPoursuite("indicateurSortie").as("tauxPoursuiteEtablissement"),
      selectTauxInsertion6mois("indicateurSortie").as("tauxInsertionEtablissement"),
      selectTauxDevenirFavorable("indicateurSortie").as("tauxDevenirFavorableEtablissement"),
      selectTauxPoursuiteAgg("indicateurRegionSortie").as("tauxPoursuite"),
      selectTauxInsertion6moisAgg("indicateurRegionSortie").as("tauxInsertion"),
      selectTauxDevenirFavorableAgg("indicateurRegionSortie").as("tauxDevenirFavorable"),
      isHistoriqueCoExistant(eb, rentreeScolaire).as("isHistoriqueCoExistant"),
      eb
        .case()
        .when("indicateurRegionSortie.cfdContinuum", "is not", null)
        .then(
          jsonBuildObject({
            cfd: eb.ref("indicateurRegionSortie.cfdContinuum"),
            libelleFormation: eb.ref("formationContinuum.libelleFormation"),
          })
        )
        .end()
        .as("continuumEtablissement"),
      eb
        .case()
        .when("indicateurSortie.cfdContinuum", "is not", null)
        .then(
          jsonBuildObject({
            cfd: eb.ref("indicateurSortie.cfdContinuum"),
            libelleFormation: eb.ref("formationContinuum.libelleFormation"),
          })
        )
        .end()
        .as("continuumEtablissement"),
      isFormationRenovee({ eb, rentreeScolaire }).as("isFormationRenovee"),
      isFormationActionPrioritaire({
        cfdRef: "formationEtablissement.cfd",
        codeDispositifRef: "formationEtablissement.codeDispositif",
        codeRegionRef: "etablissement.codeRegion",
      }).as(TypeFormationSpecifiqueEnum["Action prioritaire"]),
      sql<string | null>`
        case when ${eb.ref("formationView.dateFermeture")} is not null
        then to_char(${eb.ref("formationView.dateFermeture")}, 'dd/mm/yyyy')
        else null
        end
      `.as("dateFermeture"),
      eb
        .case()
        .when(eb("formationView.typeFamille", "in", [TypeFamilleEnum["1ere_commune"], TypeFamilleEnum["2nde_commune"]]))
        .then(
          sql<string>`COALESCE(${eb.ref("positionQuadrant")}, '-')`
        )
        .else(
          sql<string>`COALESCE(${eb.ref("positionQuadrant")}, ${PositionQuadrantEnum["Hors quadrant"]})`
        )
        .end()
        .as("positionQuadrant"),
      eb.ref("formationView.isTransitionDemographique").as(TypeFormationSpecifiqueEnum["Transition démographique"]),
      eb.ref("formationView.isTransitionEcologique").as(TypeFormationSpecifiqueEnum["Transition écologique"]),
      eb.ref("formationView.isTransitionNumerique").as(TypeFormationSpecifiqueEnum["Transition numérique"]),
      jsonArrayFrom(
        eb
          .selectFrom("indicateurRegionSortie")
          .whereRef("indicateurRegionSortie.cfd", "=", "formationView.cfd")
          .whereRef("indicateurRegionSortie.voie", "=", "formationView.voie")
          .whereRef("indicateurRegionSortie.codeDispositif", "=", "formationEtablissement.codeDispositif")
          .whereRef("indicateurRegionSortie.codeRegion", "=", "etablissement.codeRegion")
          .where("indicateurRegionSortie.millesimeSortie", "<=", millesimeSortie)
          .select([
            "indicateurRegionSortie.millesimeSortie",
            selectTauxDevenirFavorableAgg("indicateurRegionSortie").as("tauxDevenirFavorable"),
            selectTauxInsertion6moisAgg("indicateurRegionSortie").as("tauxInsertion"),
            selectTauxPoursuiteAgg("indicateurRegionSortie").as("tauxPoursuite"),
          ])
          .$narrowType<{
            millesimeSortie: string;
          }>()
          .groupBy([
            "indicateurRegionSortie.millesimeSortie",
          ])
          .orderBy("indicateurRegionSortie.millesimeSortie", "desc")
          .limit(3)
      ).as("evolutionTauxSortie"),
      jsonArrayFrom(
        eb
          .selectFrom("indicateurSortie")
          .whereRef("indicateurSortie.formationEtablissementId", "=", "formationEtablissement.id")
          .where("indicateurSortie.millesimeSortie", "<=", millesimeSortie)
          .select([
            "indicateurSortie.millesimeSortie",
            selectTauxDevenirFavorableAgg("indicateurSortie").as("tauxDevenirFavorable"),
            selectTauxInsertion6moisAgg("indicateurSortie").as("tauxInsertion"),
            selectTauxPoursuiteAgg("indicateurSortie").as("tauxPoursuite"),
          ])
          .$narrowType<{
            millesimeSortie: string;
          }>()
          .groupBy([
            "indicateurSortie.millesimeSortie",
          ])
          .orderBy("indicateurSortie.millesimeSortie", "desc")
          .limit(3)
      ).as("evolutionTauxSortieEtablissement"),
      jsonArrayFrom(
        eb
          .selectFrom("positionFormationRegionaleQuadrant")
          .whereRef("positionFormationRegionaleQuadrant.cfd", "=", "formationEtablissement.cfd")
          .whereRef("positionFormationRegionaleQuadrant.codeDispositif", "=", "formationEtablissement.codeDispositif")
          .whereRef("positionFormationRegionaleQuadrant.codeNiveauDiplome", "=", "formationView.codeNiveauDiplome")
          .whereRef("positionFormationRegionaleQuadrant.codeRegion", "=", "etablissement.codeRegion")
          .where("positionFormationRegionaleQuadrant.millesimeSortie", "<=", millesimeSortie)
          .select([
            "positionFormationRegionaleQuadrant.millesimeSortie",
            "positionFormationRegionaleQuadrant.positionQuadrant",
          ])
          .$narrowType<{
            millesimeSortie: string;
          }>()
          .groupBy([
            "positionFormationRegionaleQuadrant.millesimeSortie",
            "positionFormationRegionaleQuadrant.positionQuadrant",
          ])
          .orderBy("positionFormationRegionaleQuadrant.millesimeSortie", "desc")
          .limit(3)
      ).as("evolutionPositionQuadrant"),
      jsonArrayFrom(
        eb
          .selectFrom("indicateurEntree")
          .whereRef("indicateurEntree.formationEtablissementId", "=", "formationEtablissement.id")
          .where("indicateurEntree.rentreeScolaire", "<=", rentreeScolaire)
          .select([
            "indicateurEntree.rentreeScolaire",
            selectTauxPressionAgg("indicateurEntree", "formationView").as("tauxPression"),
            selectTauxDemandeAgg("indicateurEntree", "formationView").as("tauxDemande"),
            selectTauxRemplissageAgg("indicateurEntree").as("tauxRemplissage"),
            capaciteAnnee({ alias: "indicateurEntree" }).as("capacite"),
            effectifAnnee({ alias: "indicateurEntree" }).as("effectif"),
          ])
          .$narrowType<{
            rentreeScolaire: string;
          }>()
          .groupBy([
            "indicateurEntree.rentreeScolaire",
            "indicateurEntree.effectifs",
            "indicateurEntree.capacites",
            "indicateurEntree.anneeDebut"
          ])
          .orderBy("indicateurEntree.rentreeScolaire", "desc")
          .limit(3)
      ).as("evolutionTauxEntree"),
    ])
    .$narrowType<{
      continuumEtablissement: {
        cfd: string;
        libelleFormation: string;
      };
      continuum: {
        cfd: string;
        libelleFormation: string;
      }
      typeFamille: TypeFamille;
    }>()
    .$call((eb) => {
      if (search)
        return eb.where((eb) =>
          eb.and(
            search_array.map((search_word) =>
              eb(
                sql`concat(
                  unaccent(${eb.ref("formationView.libelleFormation")}),
                  ' ',
                  unaccent(${eb.ref("niveauDiplome.libelleNiveauDiplome")}),
                  ' ',
                  unaccent(${eb.ref("dispositif.libelleDispositif")}),
                  ' ',
                  unaccent(${eb.ref("positionFormationRegionaleQuadrant.positionQuadrant")}),
                  ' ',
                  unaccent(${eb.ref("nsf.libelleNsf")}),
                  ' ',
                  unaccent(${eb.ref("formationView.cpc")}),
                  ' ',
                  unaccent(${eb.ref("formationView.cpcSecteur")}),
                  ' ',
                  unaccent(${eb.ref("etablissement.libelleEtablissement")}),
                  ' ',
                  unaccent(${eb.ref("etablissement.commune")}),
                  ' ',
                  unaccent(${eb.ref("region.libelleRegion")}),
                  ' ',
                  unaccent(${eb.ref("academie.libelleAcademie")}),
                  ' ',
                  unaccent(${eb.ref("departement.libelleDepartement")})
                )`,
                "ilike",
                `%${search_word}%`
              )
            )
          )
        );
      return eb;
    })
    .$call((q) => {
      if (withAnneeCommune === "false") return q.where(notAnneeCommune);
      return q;
    })
    .$call((q) => {
      if (!codeRegion) return q;
      return q.where("etablissement.codeRegion", "in", codeRegion);
    })
    .$call((q) => {
      if (!codeAcademie) return q;
      return q.where("etablissement.codeAcademie", "in", codeAcademie);
    })
    .$call((q) => {
      if (!codeDepartement) return q;
      return q.where("etablissement.codeDepartement", "in", codeDepartement);
    })
    .$call((q) => {
      if (!cfd) return q;
      return q.where("formationView.cfd", "in", cfd);
    })
    .$call((q) => {
      if (!commune) return q;
      return q.where("etablissement.commune", "in", commune);
    })
    .$call((q) => {
      if (!codeDispositif) return q;
      return q.where("dispositif.codeDispositif", "in", codeDispositif);
    })
    .$call((q) => {
      if (!codeNiveauDiplome) return q;
      return q.where("dispositif.codeNiveauDiplome", "in", codeNiveauDiplome);
    })
    .$call((q) => {
      if (!cfdFamille) return q;
      return q.where((w) =>
        w.or([
          w("familleMetier.cfdFamille", "in", cfdFamille),
          w.and([w("formationView.typeFamille", "=", TypeFamilleEnum["2nde_commune"]), w("formationView.cfd", "in", cfdFamille)]),
        ])
      );
    })
    .$call((q) => {
      if (!uai) return q;
      return q.where("etablissement.uai", "in", uai);
    })
    .$call((q) => {
      if (!secteur) return q;
      return q.where("etablissement.secteur", "in", secteur);
    })
    .$call((q) => {
      if (!codeNsf) return q;
      return q.where("formationView.codeNsf", "in", codeNsf);
    })
    .$call((eb) => {
      if (!positionQuadrant) return eb;
      return eb.where("positionQuadrant", "in", positionQuadrant);
    })
    .$call((q) => {
      if (formationSpecifique?.length) {
        return q.where((w) =>
          w.or([
            formationSpecifique.includes(TypeFormationSpecifiqueEnum["Action prioritaire"])
              ? w("actionPrioritaire.cfd", "is not", null)
              : sql.val(false),
            formationSpecifique.includes(TypeFormationSpecifiqueEnum["Transition écologique"])
              ? w("formationView.isTransitionEcologique", "=", true)
              : sql.val(false),
            formationSpecifique.includes(TypeFormationSpecifiqueEnum["Transition démographique"])
              ? w("formationView.isTransitionDemographique", "=", true)
              : sql.val(false),
            formationSpecifique.includes(TypeFormationSpecifiqueEnum["Transition numérique"])
              ? w("formationView.isTransitionNumerique", "=", true)
              : sql.val(false),
          ])
        );
      }
      return q;
    })
    .where(isInPerimetreIJEtablissement)
    .where((eb) => notHistoriqueUnlessCoExistant(eb, rentreeScolaire))
    .groupBy([
      "formationView.id",
      "formationView.cfd",
      "formationView.voie",
      "formationView.libelleFormation",
      "formationView.codeNiveauDiplome",
      "formationView.typeFamille",
      "formationView.dateFermeture",
      "formationView.cpc",
      "formationView.cpcSecteur",
      "formationView.isTransitionDemographique",
      "formationView.isTransitionEcologique",
      "formationView.isTransitionNumerique",
      "dataFormation.cfd",
      "nsf.libelleNsf",
      "etablissement.id",
      "departement.libelleDepartement",
      "departement.codeDepartement",
      "academie.libelleAcademie",
      "academie.codeAcademie",
      "region.libelleRegion",
      "indicateurEntree.rentreeScolaire",
      "indicateurEntree.formationEtablissementId",
      "indicateurSortie.formationEtablissementId",
      "indicateurSortie.millesimeSortie",
      "indicateurRegionSortie.cfdContinuum",
      "formationContinuum.libelleFormation",
      "formationEtablissement.id",
      "formationEtablissement.codeDispositif",
      "libelleDispositif",
      "libelleFamille",
      "libelleNiveauDiplome",
      "indicateurEtablissement.uai",
      "indicateurEtablissement.millesime",
      "positionFormationRegionaleQuadrant.positionQuadrant",
    ])
    .$call((q) => {
      if (!orderBy || !order) return q;
      return q.orderBy(sql.ref(orderBy), sql`${sql.raw(order)} NULLS LAST`);
    })
    .orderBy("etablissement.libelleEtablissement", "asc")
    .orderBy("formationView.libelleFormation", "asc")
    .orderBy("libelleNiveauDiplome", "asc")
    .offset(offset)
    .limit(limit)
    .execute()
    .then(cleanNull);

  return {
    count: result[0]?.count ?? 0,
    etablissements: result.map((etablissement) => ({
      ...etablissement,
      isFormationRenovee: !!etablissement.isFormationRenovee,
      formationSpecifique: formatFormationSpecifique(etablissement),
    })),
  };
};
