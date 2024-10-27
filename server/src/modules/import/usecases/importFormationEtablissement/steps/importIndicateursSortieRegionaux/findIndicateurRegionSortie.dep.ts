import { getKbdClient } from "@/db/db";
import { cleanNull } from "@/utils/noNull";

export const findIndicateurRegionSortie = ({
  cfd,
  codeDispositif,
  codeRegion,
  millesimeSortie,
  voie,
}: {
  cfd: string;
  codeDispositif: string | null;
  codeRegion: string;
  millesimeSortie: string;
  voie: string;
}) =>
  getKbdClient()
    .selectFrom("indicateurRegionSortie")
    .selectAll()
    .where("cfd", "=", cfd)
    .$call((eb) => {
      if (!codeDispositif) return eb.where("codeDispositif", "is", null);
      return eb.where("codeDispositif", "=", codeDispositif);
    })
    .where("codeRegion", "=", codeRegion)
    .where("millesimeSortie", "=", millesimeSortie)
    .where("voie", "=", voie)
    .executeTakeFirst()
    .then(cleanNull);
