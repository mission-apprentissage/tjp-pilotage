import { getKbdClient } from "@/db/db";

export const getNsf = async (codeNsf: string) =>
  getKbdClient().selectFrom("nsf").where("codeNsf", "=", codeNsf).selectAll().executeTakeFirst();
