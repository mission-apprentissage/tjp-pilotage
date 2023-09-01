import { kdb } from "../../../../db/db";

export const findManyInFormationQuery = async ({
  search,
}: {
  search: string;
}) => {
  const formation = await kdb
    .selectFrom("formation")
    .select([
      "formation.codeFormationDiplome as value",
      "formation.libelleDiplome as label",
    ])
    .where((eb) =>
      eb.or([
        eb("formation.codeFormationDiplome", "ilike", `${search}%`),
        eb("formation.libelleDiplome", "ilike", `%${search}%`),
      ])
    )
    .limit(10)
    .execute();
  return formation;
};
