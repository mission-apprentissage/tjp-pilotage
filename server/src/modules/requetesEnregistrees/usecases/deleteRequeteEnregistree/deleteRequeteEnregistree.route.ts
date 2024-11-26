import { createRoute } from "@http-wizard/core";

import type { RequestUser } from "@/modules/core/model/User";
import { hasPermissionHandler } from "@/modules/core/utils/hasPermission";
import type { Server } from "@/server/server";

import { deleteRequeteEnregistreeSchema } from "./deleteRequeteEnregistree.schema";
import { deleteRequeteEnregistreeUsecase } from "./deleteRequeteEnregistree.usecase";

export const deleteRequeteEnregistreeRoute = (server: Server) => {
  return createRoute("/requeteEnregistree/:id", {
    method: "DELETE",
    schema: deleteRequeteEnregistreeSchema,
  }).handle((props) => {
    server.route({
      ...props,
      preHandler: hasPermissionHandler("enregistrement-requete/ecriture"),
      handler: async (request, response) => {
        const user = request.user as RequestUser;
        await deleteRequeteEnregistreeUsecase({ id: request.params.id, user });
        response.status(200).send();
      },
    });
  });
};
