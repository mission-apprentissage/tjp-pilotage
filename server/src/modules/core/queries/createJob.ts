import { getKbdClient } from "@/db/db";

export const createJob = async ({ name, sub }: { name: string; sub?: string }) => {
  return getKbdClient().insertInto("job").values({ name, sub }).execute();
};
