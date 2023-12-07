import { kdb } from "../../../../db/db";

export const findEtablissement = ({ uais }: { uais: string[] }) =>
  kdb
    .selectFrom("etablissement")
    .select(["UAI", "codeRegion"])
    .where("UAI", "in", uais)
    .executeTakeFirst();
