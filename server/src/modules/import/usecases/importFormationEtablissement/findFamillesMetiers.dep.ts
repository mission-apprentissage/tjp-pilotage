import { kdb } from "../../../../db/db";

export const findFamillesMetiers = ({
  offset,
  limit,
}: {
  offset: number;
  limit: number;
}) => {
  return kdb
    .selectFrom("familleMetier")
    .select("cfdFamille as cfd")
    .offset(offset)
    .limit(limit)
    .execute();
};
