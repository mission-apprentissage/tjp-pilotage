import type { Server } from "@/server/server";

import { getChangelogRoute } from "./getChangelog/getChangelog.route";

export const registerChangelogModule = ({ server }: { server: Server }) => {
  return {
    ...getChangelogRoute(server),
  };
};
