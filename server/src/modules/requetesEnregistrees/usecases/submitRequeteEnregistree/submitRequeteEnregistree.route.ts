import { createRoute } from "@http-wizard/core";

import { hasPermissionHandler } from "@/modules/core/utils/hasPermission";
import type { Server } from "@/server/server";

import { submitRequeteEnregistreeSchema } from "./submitRequeteEnregistree.schema";
import { submitRequeteEnregistreeUsecase } from "./submitRequeteEnregistree.usecase";

export const submitRequeteEnregistreeRoute = (server: Server) => {
  return createRoute("/requete/enregistrement", {
    method: "POST",
    schema: submitRequeteEnregistreeSchema,
  }).handle((props) => {
    server.route({
      ...props,
      preHandler: hasPermissionHandler("enregistrement-requete/ecriture"),
      handler: async (request, response) => {
        const requeteEnregistree = request.body;

        const result = await submitRequeteEnregistreeUsecase({
          user: request.user!,
          requeteEnregistree,
        });
        response.status(200).send(result);
      },
    });
  });
};
