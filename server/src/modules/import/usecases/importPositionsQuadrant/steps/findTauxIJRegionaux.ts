import { getKbdClient } from "@/db/db";

export const findTauxIJRegionaux = async ({
  millesimeSortie,
  codeRegion,
  codeNiveauDiplome,
}: {
  millesimeSortie: string;
  codeNiveauDiplome: string;
  codeRegion: string;
}) => {
  return getKbdClient()
    .selectFrom("tauxIJNiveauDiplomeRegion")
    .select(["tauxInsertion6mois", "tauxPoursuite"])
    .where((wb) =>
      wb.and([
        wb("millesimeSortie", "=", millesimeSortie),
        wb("codeRegion", "=", codeRegion),
        wb("codeNiveauDiplome", "=", codeNiveauDiplome),
      ]),
    )
    .executeTakeFirst();
};
