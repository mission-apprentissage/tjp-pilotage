import { createRoute } from "@http-wizard/core";
import { getPermissionScope, guardScope } from "shared";

import { hasPermissionHandler } from "@/modules/core/utils/hasPermission";
import type { Server } from "@/server/server";

import { getIntentionsSchema } from "./getIntentions.schema";
import { getIntentionsUsecase } from "./getIntentions.usecase";

export const getIntentionsRoute = (server: Server) => {
  return createRoute("/intentions", {
    method: "GET",
    schema: getIntentionsSchema,
  }).handle((props) => {
    server.route({
      ...props,
      preHandler: hasPermissionHandler("intentions-perdir/lecture"),
      handler: async (request, response) => {
        const user = request.user!;
        const { search, ...filters } = request.query;

        const result = await getIntentionsUsecase({
          user: user,
          ...filters,
          search,
        });

        const scope = getPermissionScope(user.role, "intentions-perdir/ecriture");

        response.status(200).send({
          ...result,
          intentions: result.intentions.map((intention) => ({
            ...intention,
            canEdit: guardScope(scope?.default, {
              uai: () => user.uais?.includes(intention.uai) ?? false,
              region: () => user.codeRegion === intention.codeRegion,
              national: () => true,
            }),
          })),
        });
      },
    });
  });
};
