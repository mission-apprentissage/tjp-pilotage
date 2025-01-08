import { sql } from "kysely";
import { CURRENT_RENTREE } from "shared";
import { getDateRentreeScolaire } from "shared/utils/getRentreeScolaire";

import { getKbdClient } from "@/db/db";

export const getFormationMailleEtab = ({
  codeRegion,
  codeAcademie,
  codeDepartement,
}: {
  codeRegion?: string;
  codeAcademie?: string;
  codeDepartement?: string;
}) => {
  const formations = getKbdClient()
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
      ]),
    )
    .orderBy(["libelleNsf", "libelleNiveauDiplome", "libelleFormation"])
    .distinct();

  return getKbdClient()
    .with("formations", () => formations)
    .selectFrom("formations")
    .leftJoin("formationEtablissement", "formations.cfd", "formationEtablissement.cfd")
    .innerJoin("dataEtablissement", "dataEtablissement.uai", "formationEtablissement.uai")
    .select((sb) => [
      sb.ref("formations.libelleNiveauDiplome").as("libelleNiveauDiplome"),
      sb.ref("formations.libelleFormation").as("libelleFormation"),
      sb.ref("formations.cfd").as("cfd"),
      sb.val("formations.codeNiveauDiplome").as("codeNiveauDiplome"),
      sb.ref("formations.typeFamille").as("typeFamille"),
      sb.ref("formations.codeNsf").as("codeNsf"),
      sb.ref("formationEtablissement.uai").as("uai"),
      sb.ref("formationEtablissement.voie").as("voie"),
      sb.ref("formationEtablissement.id").as("id"),
      sb.ref("dataEtablissement.codeRegion").as("codeRegion"),
      sb.ref("dataEtablissement.codeAcademie").as("codeAcademie"),
      sb.ref("dataEtablissement.codeDepartement").as("codeDepartement"),
    ])
    .orderBy([
      "formations.codeNsf",
      "formations.libelleNiveauDiplome",
      "formations.libelleFormation",
      "formations.typeFamille",
      "formations.codeNsf",
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
    });
};
