import { getKbdClient } from "@/db/db";

export const getEtablissement = ({ uai }: { uai: string }) =>
  getKbdClient().selectFrom("etablissement").where("uai", "=", uai).select("id").executeTakeFirst();
