import { kdb } from "../../../../db/db";

export const setPasswordQuery = ({
  email,
  password,
}: {
  email: string;
  password: string;
}) =>
  kdb
    .updateTable("user")
    .where("user.email", "=", email)
    .set({ password })
    .execute();
