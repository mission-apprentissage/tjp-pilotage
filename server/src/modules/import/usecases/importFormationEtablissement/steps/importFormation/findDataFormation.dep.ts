import { kdb } from "../../../../../../db/db";
import { cleanNull } from "../../../../../../utils/noNull";

export const findDataFormation = async (cfd: string) =>
  kdb
    .selectFrom("dataFormation")
    .leftJoin("nsf", "nsf.codeNsf", "dataFormation.codeNsf")
    .selectAll()
    .where("cfd", "=", cfd)
    .limit(1)
    .executeTakeFirst()
    .then(cleanNull);
