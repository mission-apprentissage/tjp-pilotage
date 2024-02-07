import { useContext } from "react";

import { ChangelogContext } from "@/app/(wrapped)/changelog/changelogContext";

export const useChangelog = () => useContext(ChangelogContext);
