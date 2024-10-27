// import { ExtraErrorData, HttpClient, ReportingObserver } from "@sentry/integrations";
import {
  captureConsoleIntegration,
  extraErrorDataIntegration,
  httpClientIntegration,
  init,
  reportingObserverIntegration,
  setTag,
} from "@sentry/nextjs";

import { publicConfig } from "./config.public";

init({
  dsn: publicConfig.sentry.dsn,
  tracesSampleRate: publicConfig.env === "production" ? 0.1 : 1.0,
  tracePropagationTargets: [/^https:\/\/[^/]*\.inserjeunes\.beta\.gouv\.fr/],
  environment: publicConfig.env,
  enabled: publicConfig.sentry.enabled,
  normalizeDepth: 8,
  // integrations: [
  //   // @ts-ignore
  //   new ExtraErrorData({ depth: 8 }),
  //   // @ts-ignore
  //   new HttpClient({}),
  //   // @ts-ignore
  //   new ReportingObserver({ types: ["crash", "deprecation", "intervention"] }),
  // ],
  integrations: [
    captureConsoleIntegration({ levels: ["error"] }),
    extraErrorDataIntegration({ depth: 8 }),
    httpClientIntegration({}),
    reportingObserverIntegration({ types: ["crash", "deprecation", "intervention"] }),
  ],
});

setTag("app", "ui");
