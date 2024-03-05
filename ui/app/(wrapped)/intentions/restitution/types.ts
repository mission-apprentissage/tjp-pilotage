import { client } from "../../../../api.client";

export type StatsIntentionsQuery =
  (typeof client.inferArgs)["[GET]/intentions/stats"]["query"];

export type Order = Pick<StatsIntentionsQuery, "order" | "orderBy">;
export type Filters = StatsIntentionsQuery;

export type StatsIntentions = (typeof client.infer)["[GET]/intentions/stats"];

export type IndicateurType = "insertion" | "poursuite";

export type CountStatsIntentionsQuery =
  (typeof client.inferArgs)["[GET]/intentions/stats/count"]["query"];

export type CountStatsIntentions =
  (typeof client.infer)["[GET]/intentions/stats/count"];
