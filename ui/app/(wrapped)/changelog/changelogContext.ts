import { createContext } from "react";

import type { client } from "@/api.client";

export type Changelog = Exclude<(typeof client.infer)["[GET]/changelog"], undefined>;
export type ChangelogEntry = Changelog[number];

interface IChangelogContext {
  changelog?: Changelog;
  setChangelog: (changelog: Changelog) => void;
}

export const ChangelogContext = createContext<IChangelogContext>({
  setChangelog: () => {},
});
