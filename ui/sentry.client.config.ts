import {
  ExtraErrorData,
  HttpClient,
  ReportingObserver,
} from "@sentry/integrations";
import * as Sentry from "@sentry/nextjs";
import { EnvEnum } from "shared/enum/envEnum";

import { publicConfig } from "./config.public";

Sentry.init({
  dsn: publicConfig.sentry_dsn,
  tracesSampleRate: publicConfig.env === EnvEnum.production ? 0.1 : 1.0,
  tracePropagationTargets: [/^https:\/\/[^/]*\.inserjeunes\.beta\.gouv\.fr/],
  environment: publicConfig.env,
  enabled: publicConfig.sentry_enabled,
  normalizeDepth: 8,
  integrations: [
    // @ts-ignore
    new ExtraErrorData({ depth: 8 }),
    // @ts-ignore
    new HttpClient({}),
    // @ts-ignore
    new ReportingObserver({ types: ["crash", "deprecation", "intervention"] }),
  ],
});

Sentry.setTag("app", "ui");
