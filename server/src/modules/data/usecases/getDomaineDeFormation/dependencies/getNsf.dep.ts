import { kdb } from "../../../../../db/db";

export const getNsf = (codeNsf: string) =>
  kdb
    .selectFrom("nsf")
    .where("codeNsf", "=", codeNsf)
    .selectAll()
    .executeTakeFirst();
