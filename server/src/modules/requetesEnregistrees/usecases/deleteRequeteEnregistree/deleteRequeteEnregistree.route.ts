import { createRoute } from "@http-wizard/core";

import { Server } from "../../../../server";
import { hasPermissionHandler } from "../../../core";
import { RequestUser } from "../../../core/model/User";
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
