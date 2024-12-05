import type { client } from "@/api.client";

export type RestitutionIntentions = (typeof client.infer)["[GET]/restitution-intentions"];
export type DemandesRestitutionIntentions = (typeof client.infer)["[GET]/restitution-intentions"]["demandes"];
export type StatsRestitutionIntentions = (typeof client.infer)["[GET]/restitution-intentions"]["stats"];

export type FiltersRestitutionIntentions = (typeof client.inferArgs)["[GET]/restitution-intentions"]["query"];

export type OrderRestitutionIntentions = Pick<FiltersRestitutionIntentions, "order" | "orderBy">;

export type IndicateurType = "insertion" | "poursuite";
