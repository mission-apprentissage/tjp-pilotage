import { ExtraErrorData, HttpClient } from "@sentry/integrations";
import * as Sentry from "@sentry/nextjs";

import { publicConfig } from "./config.public";

Sentry.init({
  dsn: publicConfig.sentry.dsn,
  tracesSampleRate: publicConfig.env === "production" ? 0.1 : 1.0,
  tracePropagationTargets: [/^https:\/\/[^/]*\.inserjeunes\.beta\.gouv\.fr/],
  environment: publicConfig.env,
  enabled: publicConfig.sentry.enabled,
  normalizeDepth: 8,
  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
    // @ts-ignore
    new ExtraErrorData({ depth: 8 }),
    // @ts-ignore
    new HttpClient({}),
  ],
});
