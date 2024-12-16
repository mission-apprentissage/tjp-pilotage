import { CURRENT_RENTREE } from "shared";

import { getKbdClient } from "@/db/db";
import { notHistoriqueUnlessCoExistant } from "@/modules/data/utils/notHistorique";
import { cleanNull } from "@/utils/noNull";

export const getFormation = async ({ cfd }: { cfd: string }) => {
  return getKbdClient()
    .selectFrom("formationView")
    .innerJoin("niveauDiplome", "niveauDiplome.codeNiveauDiplome", "formationView.codeNiveauDiplome")
    .innerJoin("nsf", "nsf.codeNsf", "formationView.codeNsf")
    .select(["formationView.libelleFormation", "formationView.cfd"])
    .where((wb) => notHistoriqueUnlessCoExistant(wb, CURRENT_RENTREE))
    .where("formationView.cfd", "=", cfd)
    .select((sb) => [sb.ref("formationView.libelleFormation").as("libelle"), sb.ref("formationView.cfd").as("cfd")])
    .executeTakeFirst()
    .then(cleanNull);
};
