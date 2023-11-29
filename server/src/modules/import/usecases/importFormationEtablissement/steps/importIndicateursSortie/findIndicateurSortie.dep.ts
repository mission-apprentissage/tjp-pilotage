import { kdb } from "../../../../../../db/db";
import { cleanNull } from "../../../../../../utils/noNull";

export const findIndicateurSortie = ({
  cfd,
  dispositifId,
  uai,
  millesimeSortie,
}: {
  cfd: string;
  dispositifId: string;
  uai: string;
  millesimeSortie: string;
}) =>
  kdb
    .selectFrom("indicateurSortie")
    .innerJoin(
      "formationEtablissement",
      "formationEtablissement.id",
      "indicateurSortie.formationEtablissementId"
    )
    .selectAll("indicateurSortie")
    .select("formationEtablissement.cfd")
    .where("cfd", "=", cfd)
    .where("dispositifId", "=", dispositifId)
    .where("UAI", "=", uai)
    .where("millesimeSortie", "=", millesimeSortie)
    .executeTakeFirst()
    .then(cleanNull);
