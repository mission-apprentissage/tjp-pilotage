import { getKbdClient } from "@/db/db";
import { cleanNull } from "@/utils/noNull";

export const findDataFormation = async (cfd: string) =>
  getKbdClient()
    .selectFrom("dataFormation")
    .leftJoin("nsf", "nsf.codeNsf", "dataFormation.codeNsf")
    .selectAll()
    .where("cfd", "=", cfd)
    .limit(1)
    .executeTakeFirst()
    .then(cleanNull);
