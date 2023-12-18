import { kdb } from "../../../../db/db";

export const findEtablissement = ({ uais }: { uais: string[] }) =>
  kdb
    .selectFrom("dataEtablissement")
    .select(["uai", "codeRegion"])
    .where("uai", "in", uais)
    .executeTakeFirst();
