import { kdb } from "../../../../../../db/db";

export const findDepartement = async ({
  codeDepartement,
}: {
  codeDepartement: string;
}) => {
  return kdb
    .selectFrom("departement")
    .selectAll("departement")
    .where("codeDepartement", "=", codeDepartement)
    .executeTakeFirst();
};
