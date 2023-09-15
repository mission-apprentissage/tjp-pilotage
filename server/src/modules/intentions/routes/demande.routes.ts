import Boom from "@hapi/boom";
import { ROUTES_CONFIG } from "shared";

import { Server } from "../../../server";
import { hasPermissionHandler } from "../../core";
import { countDemandes } from "../queries/countDemandes.query";
import { findDemande } from "../queries/findDemande.query";
import { findDemandes } from "../queries/findDemandes.query";
import { submitDemande } from "../usecases/submitDemande/submitDemande.usecase";
import { submitDraftDemande } from "../usecases/submitDraftDemande/submitDraftDemande.usecase";

export const demandeRoutes = ({ server }: { server: Server }) => {
  server.post(
    "/demande/submit",
    {
      schema: ROUTES_CONFIG.submitDemande,
      preHandler: hasPermissionHandler("intentions/envoi"),
    },
    async (request, response) => {
      const { demande } = request.body;
      if (!request.user) throw Boom.unauthorized();
      const result = await submitDemande({
        demande,
        userId: request.user.id,
      });
      response.status(200).send(result);
    }
  );

  server.post(
    "/demande/draft",
    {
      schema: ROUTES_CONFIG.submitDraftDemande,
      preHandler: hasPermissionHandler("intentions/envoi"),
    },
    async (request, response) => {
      const { demande } = request.body;
      if (!request.user) throw Boom.unauthorized();
      const result = await submitDraftDemande({
        demande,
        userId: request.user.id,
      });
      response.status(200).send(result);
    }
  );

  server.get(
    "/demande/:id",
    {
      schema: ROUTES_CONFIG.getDemande,
      preHandler: hasPermissionHandler("intentions/envoi"),
    },
    async (request, response) => {
      const result = await findDemande({ id: request.params.id });
      response.status(200).send(result);
    }
  );

  server.get(
    "/demandes",
    {
      schema: ROUTES_CONFIG.getDemandes,
      preHandler: hasPermissionHandler("intentions/envoi"),
    },
    async (request, response) => {
      const { order, orderBy, ...rest } = request.query;
      const result = await findDemandes({
        ...rest,
        offset: 0,
        limit: 1000000,
        orderBy: order && orderBy ? { order, column: orderBy } : undefined,
      });
      response.status(200).send(result);
    }
  );

  server.get(
    "/demandes/count",
    {
      schema: ROUTES_CONFIG.countDemandes,
      preHandler: hasPermissionHandler("intentions/envoi"),
    },
    async (request, response) => {
      const { status } = request.query;
      const result = await countDemandes({
        status: status,
      });
      response.status(200).send(result);
    }
  );
};
