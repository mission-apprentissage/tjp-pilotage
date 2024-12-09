import { getKbdClient } from "@/db/db";
import { cleanNull } from "@/utils/noNull";

export const findOneDataFormation = async ({ cfd }: { cfd: string }) => {
  const formation = await getKbdClient()
    .selectFrom("dataFormation")
    .selectAll()
    .where("cfd", "=", cfd)
    .limit(1)
    .executeTakeFirst();
  return cleanNull(formation);
};
