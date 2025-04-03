import { getKbdClient } from "@/db/db";

export const findDataFormation = ({ cfd }: { cfd: string }) => {
  return getKbdClient()
    .selectFrom("dataFormation")
    .select(["dateOuverture", "dateFermeture"])
    .where("cfd", "=", cfd)
    .executeTakeFirst();
};
