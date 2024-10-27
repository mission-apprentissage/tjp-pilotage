import * as Sentry from "@sentry/node";

import type { Server } from "@/server/server";

export function initSentryFastify(app: Server) {
  app.addHook("onRequest", async (request, _reply) => {
    const scope = Sentry.getIsolationScope();
    scope
      .setExtra("headers", request.headers)
      .setExtra("method", request.method)
      .setExtra("protocol", request.protocol)
      .setExtra("query_string", request.query);
  });
}
