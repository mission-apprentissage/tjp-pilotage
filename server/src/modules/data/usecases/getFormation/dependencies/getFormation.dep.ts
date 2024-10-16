import { sql } from "kysely";
import { CURRENT_RENTREE } from "shared";
import { getDateRentreeScolaire } from "shared/utils/getRentreeScolaire";

import { getKbdClient } from "@/db/db";
import { cleanNull } from "@/utils/noNull";

import { getFormationMailleEtab } from "./getFormationMailleEtab.dep";

export const getFormation = async ({
  cfd,
  codeRegion,
  codeDepartement,
  codeAcademie,
}: {
  cfd: string;
  codeRegion?: string;
  codeDepartement?: string;
  codeAcademie?: string;
}) => {
  const listOfCfdWhichAreTransitionNumerique = getKbdClient()
    .selectFrom(
      getKbdClient()
        .selectFrom("formationView")
        .innerJoin("niveauDiplome", "niveauDiplome.codeNiveauDiplome", "formationView.codeNiveauDiplome")
        .leftJoin("formationRome", "formationRome.cfd", "formationView.cfd")
        .leftJoin("rome", "rome.codeRome", "formationRome.codeRome")
        .select((sb) => [
          sb.ref("formationView.cfd").as("cfd"),
          sb.ref("niveauDiplome.libelleNiveauDiplome").as("libelleNiveauDiplome"),
          sb.ref("formationView.libelleFormation").as("libelleFormation"),
          sql<number>`count(distinct ${sb.ref("formationRome.codeRome")})`.as("nb romes total"),
          sql<number>`count(distinct case when ${sb.ref(
            "rome.transitionNumerique"
          )} then ${sb.ref("formationRome.codeRome")} end)`.as("nb romes TN"),
        ])
        .groupBy(["formationView.cfd", "niveauDiplome.libelleNiveauDiplome", "formationView.libelleFormation"])
        .as("sous_requete")
    )
    .select((sb) => [sb.ref("sous_requete.cfd").as("cfd")])
    .where("nb romes total", ">", 0)
    .where("sous_requete.cfd", "=", cfd)
    .whereRef("nb romes total", "=", "nb romes TN");

  const listOfCfdWhichAreTransitionEcologique = getKbdClient()
    .selectFrom(
      getKbdClient()
        .selectFrom("formationView")
        .innerJoin("niveauDiplome", "niveauDiplome.codeNiveauDiplome", "formationView.codeNiveauDiplome")
        .leftJoin("formationRome", "formationRome.cfd", "formationView.cfd")
        .leftJoin("rome", "rome.codeRome", "formationRome.codeRome")
        .select((sb) => [
          sb.ref("formationView.cfd").as("cfd"),
          sb.ref("niveauDiplome.libelleNiveauDiplome").as("libelleNiveauDiplome"),
          sb.ref("formationView.libelleFormation").as("libelleFormation"),
          sql<number>`count(distinct ${sb.ref("formationRome.codeRome")})`.as("nb romes total"),
          sql<number>`count(distinct case when ${sb.ref(
            "rome.transitionEcologique"
          )} then ${sb.ref("formationRome.codeRome")} end)`.as("nb romes TE"),
        ])
        .groupBy(["formationView.cfd", "niveauDiplome.libelleNiveauDiplome", "formationView.libelleFormation"])
        .as("sous_requete")
    )
    .select((sb) => [sb.ref("sous_requete.cfd").as("cfd")])
    .where("sous_requete.cfd", "=", cfd)
    .where("nb romes total", ">", 0)
    .whereRef("nb romes total", "=", "nb romes TE");

  const listOfCfdWhichAreTransitionDemographique = getKbdClient()
    .selectFrom(
      getKbdClient()
        .selectFrom("formationView")
        .innerJoin("niveauDiplome", "niveauDiplome.codeNiveauDiplome", "formationView.codeNiveauDiplome")
        .leftJoin("formationRome", "formationRome.cfd", "formationView.cfd")
        .leftJoin("rome", "rome.codeRome", "formationRome.codeRome")
        .select((sb) => [
          sb.ref("formationView.cfd").as("cfd"),
          sb.ref("niveauDiplome.libelleNiveauDiplome").as("libelleNiveauDiplome"),
          sb.ref("formationView.libelleFormation").as("libelleFormation"),
          sql<number>`count(distinct ${sb.ref("formationRome.codeRome")})`.as("nb romes total"),
          sql<number>`count(distinct case when ${sb.ref(
            "rome.transitionDemographique"
          )} then ${sb.ref("formationRome.codeRome")} end)`.as("nb romes TD"),
        ])
        .groupBy(["formationView.cfd", "niveauDiplome.libelleNiveauDiplome", "formationView.libelleFormation"])
        .as("sous_requete")
    )
    .select((sb) => [sb.ref("sous_requete.cfd").as("cfd")])
    .where("sous_requete.cfd", "=", cfd)
    .where("nb romes total", ">", 0)
    .whereRef("nb romes total", "=", "nb romes TD");

  const getFormation = () =>
    getKbdClient()
      .selectFrom("formationView")
      .innerJoin("niveauDiplome", "niveauDiplome.codeNiveauDiplome", "formationView.codeNiveauDiplome")
      .innerJoin("nsf", "nsf.codeNsf", "formationView.codeNsf")
      .select([
        "libelleNsf",
        "libelleNiveauDiplome",
        "formationView.codeNiveauDiplome",
        "formationView.libelleFormation",
        "formationView.cfd",
        "formationView.codeNsf",
        "dateFermeture",
        "typeFamille",
      ])
      .where((eb) =>
        eb.or([
          eb("dateFermeture", "is", null),
          eb("dateFermeture", ">", sql<Date>`${getDateRentreeScolaire(CURRENT_RENTREE)}`),
        ])
      )
      .orderBy(["libelleNsf", "libelleNiveauDiplome", "libelleFormation"])
      .distinct();

  return getKbdClient()
    .with("formation", () => getFormation())
    .with("formation_maille_etab", () =>
      getFormationMailleEtab({
        codeRegion,
        codeDepartement,
        codeAcademie,
      })
    )
    .with("inTransitionNumerique", () => listOfCfdWhichAreTransitionNumerique)
    .with("inTransitionEcologique", () => listOfCfdWhichAreTransitionEcologique)
    .with("inTransitionDemographique", () => listOfCfdWhichAreTransitionDemographique)
    .selectFrom("formation")
    .leftJoin("inTransitionNumerique", "formation.cfd", "inTransitionNumerique.cfd")
    .leftJoin("inTransitionEcologique", "formation.cfd", "inTransitionEcologique.cfd")
    .leftJoin("inTransitionDemographique", "formation.cfd", "inTransitionDemographique.cfd")
    .leftJoin("formation_maille_etab", "formation.cfd", "formation_maille_etab.cfd")
    .where("formation.cfd", "=", cfd)
    .select((sb) => [
      sql<string>`concat( ${sb.ref(
        "formation.libelleNiveauDiplome"
      )}, ' - ', ${sb.ref("formation.libelleFormation")})`.as("libelle"),
      sb.ref("formation.cfd").as("cfd"),
      sb.ref("formation.codeNiveauDiplome").as("codeNiveauDiplome"),
      sb.ref("formation.typeFamille").as("typeFamille"),
      sb.ref("formation.codeNsf").as("codeNsf"),
      sql<boolean>`case when left(${sb.ref("formation.cfd")}, 3) = '320' then true else false end`.as("isBTS"),
      sb
        .case()
        .when("formation.cfd", "in", (sb) => sb.selectFrom("inTransitionNumerique").select("cfd"))
        .then(true)
        .else(false)
        .end()
        .as("isTransitionNumerique"),
      sb
        .case()
        .when("formation.cfd", "in", (sb) => sb.selectFrom("inTransitionEcologique").select("cfd"))
        .then(true)
        .else(false)
        .end()
        .as("isTransitionEcologique"),
      sb
        .case()
        .when("formation.cfd", "in", (sb) => sb.selectFrom("inTransitionDemographique").select("cfd"))
        .then(true)
        .else(false)
        .end()
        .as("isTransitionDemographique"),
      sql<boolean>`bool_or(${sb.ref("formation_maille_etab.voie")} = 'apprentissage' OR ${sb.ref(
        "formation_maille_etab.voie"
      )} IS NULL)`.as("isApprentissage"),
      sql<boolean>`bool_or(${sb.ref(
        "formation_maille_etab.voie"
      )} = 'scolaire' OR ${sb.ref("formation_maille_etab.voie")} IS NULL)`.as("isScolaire"),
      sb
        .case()
        .when(sb.fn.count<number>("formation_maille_etab.uai"), ">", 0)
        .then(true)
        .else(false)
        .end()
        .as("isInScope"),
    ])
    .groupBy([
      "formation.cfd",
      "formation.libelleNiveauDiplome",
      "formation.libelleFormation",
      "formation.codeNiveauDiplome",
      "formation.typeFamille",
      "formation.codeNsf",
    ])
    .executeTakeFirst()
    .then(cleanNull);
};
