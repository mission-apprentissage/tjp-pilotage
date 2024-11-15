import { useContext } from "react";

import { ChangelogContext } from "./changelogContext";

export const useChangelog = () => useContext(ChangelogContext);
