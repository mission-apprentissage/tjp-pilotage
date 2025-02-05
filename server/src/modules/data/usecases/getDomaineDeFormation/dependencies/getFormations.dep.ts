import { sql } from "kysely";
import { CURRENT_RENTREE } from "shared";
import type { formationSchema } from "shared/routes/schemas/get.domaine-de-formation.codeNsf.schema";
import { getDateRentreeScolaire } from "shared/utils/getRentreeScolaire";
import type { z } from "zod";

import { getKbdClient } from "@/db/db";
import { notHistoriqueUnlessCoExistant } from "@/modules/data/utils/notHistorique";
import { cleanNull } from "@/utils/noNull";

export const getFormations = async ({
  codeNsf,
  codeRegion,
  codeDepartement,
  codeAcademie,
}: {
  codeNsf: string;
  codeRegion?: string;
  codeDepartement?: string;
  codeAcademie?: string;
}) =>
  getKbdClient()
    .with("formations", (wb) =>
      wb
        .selectFrom("formationView")
        .innerJoin("niveauDiplome", "niveauDiplome.codeNiveauDiplome", "formationView.codeNiveauDiplome")
        .where("formationView.codeNsf", "=", codeNsf)
        .where((w) => notHistoriqueUnlessCoExistant(w, CURRENT_RENTREE))
        .select((sb) => [
          sb.ref("formationView.codeNsf").as("codeNsf"),
          sb.ref("formationView.cfd").as("cfd"),
          sb.ref("formationView.libelleFormation").as("libelleFormation"),
          sb.ref("formationView.dateOuverture").as("dateOuverture"),
          sb.ref("niveauDiplome.libelleNiveauDiplome").as("libelleNiveauDiplome"),
          sb.ref("niveauDiplome.codeNiveauDiplome").as("codeNiveauDiplome"),
          sb.ref("formationView.typeFamille").as("typeFamille"),
        ])
        .orderBy("formationView.libelleFormation", "asc")
        .distinct()
    )
    .with("formation_renovee", (wb) =>
      wb
        .selectFrom("formations")
        .leftJoin("formationHistorique", "formationHistorique.cfd", "formations.cfd")
        .leftJoin("formationView as fva", "fva.cfd", "formationHistorique.ancienCFD")
        .where(wb => wb.and([
          wb("formations.dateOuverture", "<=", sql<Date>`${getDateRentreeScolaire(CURRENT_RENTREE)}`),
          wb("fva.dateFermeture", "is not", null),
          wb("fva.dateFermeture", ">", sql<Date>`${getDateRentreeScolaire(CURRENT_RENTREE)}`),
          wb("formationHistorique.ancienCFD", "in", (eb) => eb.selectFrom("formationEtablissement").select("cfd"))
        ]))
        .select("formationHistorique.cfd")
        .distinct()
    )
    .with("formation_etab", (wb) =>
      wb
        .selectFrom("formations")
        .leftJoin("formationEtablissement", "formations.cfd", "formationEtablissement.cfd")
        .innerJoin("dataEtablissement", "dataEtablissement.uai", "formationEtablissement.uai")
        .selectAll("formations")
        .select((sb) => [
          sb.ref("formationEtablissement.uai").as("uai"),
          sb.ref("formationEtablissement.voie").as("voie"),
          sb.ref("dataEtablissement.codeRegion").as("codeRegion"),
          sb.ref("dataEtablissement.codeAcademie").as("codeAcademie"),
          sb.ref("dataEtablissement.codeDepartement").as("codeDepartement"),
        ])
        .$call((q) => {
          if (codeRegion) {
            return q.where("codeRegion", "=", codeRegion);
          }
          return q;
        })
        .$call((q) => {
          if (codeAcademie) {
            return q.where("codeAcademie", "=", codeAcademie);
          }
          return q;
        })
        .$call((q) => {
          if (codeDepartement) {
            return q.where("codeDepartement", "=", codeDepartement);
          }
          return q;
        })
    )
    .selectFrom("formations")
    .leftJoin("formation_etab", "formations.cfd", "formation_etab.cfd")
    .selectAll("formations")
    .select((sb) => [
      sb.fn.count<number>("formation_etab.uai").as("nbEtab"),
      sql<boolean>`bool_or(voie = 'apprentissage' OR voie IS NULL)`.as("apprentissage"),
      sql<boolean>`bool_or(voie = 'scolaire' OR voie IS NULL)`.as("scolaire"),
      sb.fn
        .coalesce(sql<boolean>`formations.cfd IN (SELECT cfd FROM formation_renovee)`, sql<boolean>`false`)
        .as("isFormationRenovee"),
    ])
    .distinct()
    .groupBy([
      "formations.cfd",
      "formations.libelleFormation",
      "formations.libelleNiveauDiplome",
      "formations.codeNiveauDiplome",
      "formations.typeFamille",
      "formations.codeNsf",
      "formations.dateOuverture",
    ])
    .$castTo<z.infer<typeof formationSchema>>()
    .execute()
    .then(cleanNull);
