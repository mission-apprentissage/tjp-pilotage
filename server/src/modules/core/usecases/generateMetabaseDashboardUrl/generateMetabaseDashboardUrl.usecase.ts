// eslint-disable-next-line import/no-extraneous-dependencies, n/no-extraneous-import
import { inject } from "injecti";
import * as jwt from "jsonwebtoken";

import config from "@/config";
import { getDneClient } from "@/modules/core/services/dneClient/dneClient";

export const [getMetabaseDashboardUrl, getMetabaseDashboardUrlFactory] = inject(
  {
    getDneClient,
    signJwt: jwt.sign,
  },
  (deps) =>
    async ({ dashboard, filters }: { dashboard: number; filters: { [key: string]: string | null } }) => {
      const METABASE_SITE_URL = "https://orion.inserjeunes.beta.gouv.fr/metabase";
      const METABASE_SECRET_KEY = config.metabase.token;

      const payload = {
        resource: { dashboard },
        params: { ...filters },
        exp: Math.round(Date.now() / 1000) + 10 * 60, // 10 minute expiration
      };
      const token = deps.signJwt(payload, METABASE_SECRET_KEY);

      return `${METABASE_SITE_URL}/embed/dashboard/${token}#bordered=true&titled=true`;
    }
);
