import { client } from "@/api.client";

export type NsfOptions = (typeof client.infer)["[GET]/domaine-de-formation"];
export type NsfOption =
  (typeof client.infer)["[GET]/domaine-de-formation"][number];
