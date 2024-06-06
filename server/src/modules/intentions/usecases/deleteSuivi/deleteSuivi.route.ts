import { createRoute } from "@http-wizard/core";

import { Server } from "../../../../server";
import { hasPermissionHandler } from "../../../core";
import { RequestUser } from "../../../core/model/User";
import { deleteSuiviSchema } from "./deleteSuivi.schema";
import { deleteSuiviUsecase } from "./deleteSuivi.usecase";

export const deleteSuiviRoute = (server: Server) => {
  return createRoute("/intention/suivi/:id", {
    method: "DELETE",
    schema: deleteSuiviSchema,
  }).handle((props) => {
    server.route({
      ...props,
      preHandler: hasPermissionHandler("intentions-perdir/lecture"),
      handler: async (request, response) => {
        const user = request.user as RequestUser;
        await deleteSuiviUsecase({ id: request.params.id, user });
        response.status(200).send();
      },
    });
  });
};
