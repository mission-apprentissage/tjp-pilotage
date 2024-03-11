import { FastifyRequestType } from "fastify/types/type-provider";
import { inject } from "injecti";

import { RequestUser } from "../../model/User";
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
  (deps: {
    updateUserLastSeenAt: (props: { email: string }) => Promise<void>;
  }) =>
    async (request: FastifyRequestType) => {
      if (!request.user) return;
      await deps.updateUserLastSeenAt({ email: request.user.email });
      return;
    }
);

export { userLastSeenAt, userLastSeenAtFactory };
