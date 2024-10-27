import { getKbdClient } from "@/db/db";

export const findFamillesMetiers = ({ offset, limit }: { offset: number; limit: number }) => {
  return getKbdClient()
    .selectFrom("familleMetier")
    .select("cfdFamille as cfd")
    .distinct()
    .offset(offset)
    .limit(limit)
    .execute();
};
