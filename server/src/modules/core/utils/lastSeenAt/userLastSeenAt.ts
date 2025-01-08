import type { FastifyRequestType } from "fastify/types/type-provider";
// eslint-disable-next-line import/no-extraneous-dependencies, n/no-extraneous-import
import { inject } from "injecti";

import type { RequestUser } from "@/modules/core/model/User";

import { updateUserLastSeenAt } from "./updateUserLastSeenAt.dep";

declare module "fastify" {
  interface FastifyRequest {
    user?: RequestUser;
  }
}

declare module "fastify/types/type-provider" {
  interface FastifyRequestType {
    user?: RequestUser;
  }
}

const [userLastSeenAt, userLastSeenAtFactory] = inject(
  {
    updateUserLastSeenAt: updateUserLastSeenAt,
  },
  (deps: { updateUserLastSeenAt: (props: { email: string }) => Promise<void> }) =>
    async (request: FastifyRequestType) => {
      if (!request.user) return;
      await deps.updateUserLastSeenAt({ email: request.user.email });
      return;
    },
);

export { userLastSeenAt, userLastSeenAtFactory };
