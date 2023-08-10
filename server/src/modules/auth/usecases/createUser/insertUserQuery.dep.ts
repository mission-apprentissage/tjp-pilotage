import { kdb } from "../../../../db/db";

export const insertUserQuery = async (user: {
  email: string;
  firstname?: string;
  lastname?: string;
}) => {
  await kdb.insertInto("user").values(user).execute();
};
