import * as Sentry from "@sentry/node";
import { nodeProfilingIntegration } from "@sentry/profiling-node";

import config from "@/config";

function getOptions(): Sentry.NodeOptions {
  return {
    tracesSampleRate: config.env === "production" ? 0.1 : 1.0,
    tracePropagationTargets: [/^https:\/\/[^/]*\.inserjeunes\.beta\.gouv\.fr/],
    profilesSampleRate: config.env === "production" ? 0.1 : 1.0,
    environment: config.env,
    release: config.version,
    enabled: config.env !== "local",
    integrations: [
      Sentry.httpIntegration(),
      Sentry.captureConsoleIntegration({ levels: ["error"] }),
      Sentry.extraErrorDataIntegration({ depth: 16 }),
      nodeProfilingIntegration(),
    ],
  };
}

export function initSentry(): void {
  Sentry.init(getOptions());
  Sentry.setTag("app", "server");
}

export async function closeSentry(): Promise<void> {
  await Sentry.close(2_000);
}
