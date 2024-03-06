import { kdb } from "../../../../../../db/db";
import { cleanNull } from "../../../../../../utils/noNull";

export const findIndicateurSortie = ({
  cfd,
  codeDispositif,
  uai,
  millesimeSortie,
}: {
  cfd: string;
  codeDispositif: string | null;
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
    .$call((eb) => {
      if (!codeDispositif) return eb.where("dispositifId", "is", null);
      return eb.where("dispositifId", "=", codeDispositif);
    })
    .where("UAI", "=", uai)
    .where("millesimeSortie", "=", millesimeSortie)
    .executeTakeFirst()
    .then(cleanNull);
