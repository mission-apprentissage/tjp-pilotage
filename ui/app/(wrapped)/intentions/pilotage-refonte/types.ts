import { client } from "../../../../api.client";

export type StatsPilotageIntentions =
  (typeof client.infer)["[GET]/pilotage-intentions/stats"];

export type StatsPilotageIntentionsQuery =
  (typeof client.inferArgs)["[GET]/pilotage-intentions/stats"]["query"];

export type FiltersStatsPilotageIntentions = Omit<
  StatsPilotageIntentionsQuery,
  "order" | "orderBy"
>;
