import { getKbdClient } from "@/db/db";

export const findEtablissement = async ({ uais }: { uais: string[] }) =>
  await getKbdClient()
    .selectFrom("dataEtablissement")
    .select(["uai", "codeRegion"])
    .where("uai", "in", uais)
    .executeTakeFirst();
