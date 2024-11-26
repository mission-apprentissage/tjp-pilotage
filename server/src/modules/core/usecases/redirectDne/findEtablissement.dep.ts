import { getKbdClient } from "@/db/db";

export const findEtablissement = async ({ uais }: { uais: string[] }) =>
  getKbdClient()
    .selectFrom("dataEtablissement")
    .select(["uai", "codeRegion"])
    .where("uai", "in", uais)
    .executeTakeFirst();
