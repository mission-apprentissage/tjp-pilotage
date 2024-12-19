import { sql } from "kysely";
import { CURRENT_RENTREE } from "shared";
import { getDateRentreeScolaire } from "shared/utils/getRentreeScolaire";

import { getKbdClient } from "@/db/db";
import { notHistoriqueUnlessCoExistant } from "@/modules/data/utils/notHistorique";
import { cleanNull } from "@/utils/noNull";

import { getFormationMailleEtab } from "./getFormationMailleEtab.dep";

function getListOfCfdWhichAreTransition(
  transitionType: "transitionNumerique" | "transitionEcologique" | "transitionDemographique",
  cfd: string
) {
  return getKbdClient()
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
          sql<number>`count(distinct ${sb.ref("formationRome.codeRome")})`.as("nbRomesTotal"),
          sql<number>`count(distinct case when ${sb.ref(
            `rome.${transitionType}`
          )} then ${sb.ref("formationRome.codeRome")} end)`.as(`nbRomes${transitionType}`),
        ])
        .groupBy(["formationView.cfd", "niveauDiplome.libelleNiveauDiplome", "formationView.libelleFormation"])
        .as("count_romes_transition")
    )
    .select((sb) => [sb.ref("count_romes_transition.cfd").as("cfd")])
    .where("count_romes_transition.cfd", "=", cfd)
    .where("nbRomesTotal", ">", 0)
    .whereRef("nbRomesTotal", "=", `nbRomes${transitionType}`);
}

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
  // Utilisation de la fonction générique
  const listOfCfdWhichAreTransitionNumerique = getListOfCfdWhichAreTransition("transitionNumerique", cfd);
  const listOfCfdWhichAreTransitionEcologique = getListOfCfdWhichAreTransition("transitionEcologique", cfd);
  const listOfCfdWhichAreTransitionDemographique = getListOfCfdWhichAreTransition("transitionDemographique", cfd);

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
        "dateOuverture",
        "dateFermeture",
        "typeFamille",
      ])
      .where((eb) => notHistoriqueUnlessCoExistant(eb, CURRENT_RENTREE))
      .orderBy(["libelleNsf", "libelleNiveauDiplome", "libelleFormation"])
      .distinct();

  const getFormationRenovee = () =>
    getKbdClient()
      .selectFrom("formationHistorique")
      .leftJoin("formationView", "formationHistorique.cfd", "formationView.cfd")
      .where("formationHistorique.cfd", "=", cfd)
      .where("formationView.dateOuverture", "<=", sql<Date>`${getDateRentreeScolaire(CURRENT_RENTREE)}`)
      .where("formationHistorique.ancienCFD", "in", (eb) => eb.selectFrom("formationEtablissement").select("cfd"))
      .select("formationView.cfd")
      .distinct();

  return getKbdClient()
    .with("formation", () => getFormation())
    .with("formation_renovee", () => getFormationRenovee())
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
      sb
        .case()
        .when("formation.cfd", "in", (sb) => sb.selectFrom("formation_renovee").select("cfd"))
        .then(true)
        .else(false)
        .end()
        .as("isFormationRenovee"),
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
