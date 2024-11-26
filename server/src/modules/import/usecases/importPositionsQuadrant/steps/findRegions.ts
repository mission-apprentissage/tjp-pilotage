import { getKbdClient } from "@/db/db";

export const findRegions = async () => await getKbdClient().selectFrom("region").select(["codeRegion"]).execute();
