import { Server } from "../../server";
import { getChangelogRoute } from "./getChangelog/getChangelog.route";

export const registerChangelogModule = ({ server }: { server: Server }) => {
  return {
    ...getChangelogRoute(server),
  };
};
