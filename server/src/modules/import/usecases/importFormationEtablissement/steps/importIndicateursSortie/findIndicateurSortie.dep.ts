import { getKbdClient } from "@/db/db";
import { cleanNull } from "@/utils/noNull";

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
  getKbdClient()
    .selectFrom("indicateurSortie")
    .innerJoin("formationEtablissement", "formationEtablissement.id", "indicateurSortie.formationEtablissementId")
    .selectAll("indicateurSortie")
    .select("formationEtablissement.cfd")
    .where("cfd", "=", cfd)
    .$call((eb) => {
      if (!codeDispositif) return eb.where("codeDispositif", "is", null);
      return eb.where("codeDispositif", "=", codeDispositif);
    })
    .where("uai", "=", uai)
    .where("millesimeSortie", "=", millesimeSortie)
    .executeTakeFirst()
    .then(cleanNull);
