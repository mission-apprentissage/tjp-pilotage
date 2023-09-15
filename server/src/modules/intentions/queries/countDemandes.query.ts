import { kdb } from "../../../db/db";

export const countDemandes = async ({
  status,
}: {
  status?: "draft" | "submitted";
}) => {
  const countDemandes = await kdb
    .selectFrom("demande")
    .select(({ fn }) => fn.count("demande.id").as("count"))
    .$call((eb) => {
      if (status) return eb.where("demande.status", "=", status);
      return eb;
    })
    .executeTakeFirstOrThrow();

  return countDemandes.count.toString();
};
