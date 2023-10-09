import Boom from "@hapi/boom";
//@ts-ignore
import { Parser } from "@json2csv/plainjs";
import {
  DEMANDES_COLUMNS,
  getPermissionScope,
  guardScope,
  ROUTES_CONFIG,
  STATS_DEMANDES_COLUMNS,
} from "shared";

import { Server } from "../../../server";
import { hasPermissionHandler } from "../../core";
import { countDemandes } from "../queries/countDemandes.query";
import { countStatsDemandes } from "../queries/countStatsDemandes.query";
import { findDemande } from "../queries/findDemande.query";
import { findDemandes } from "../queries/findDemandes.query";
import { getStatsDemandes } from "../queries/getStatsDemandes.query";
import { deleteDemande } from "../usecases/deleteDemande/deleteDemande.usecase";
import { submitDemande } from "../usecases/submitDemande/submitDemande.usecase";
import { submitDraftDemande } from "../usecases/submitDraftDemande/submitDraftDemande.usecase";

export const demandeRoutes = ({ server }: { server: Server }) => {
  server.post(
    "/demande/submit",
    {
      schema: ROUTES_CONFIG.submitDemande,
      preHandler: hasPermissionHandler("intentions/ecriture"),
    },
    async (request, response) => {
      const { demande } = request.body;
      if (!request.user) throw Boom.unauthorized();

      const result = await submitDemande({
        demande,
        user: request.user,
      });
      response.status(200).send(result);
    }
  );

  server.post(
    "/demande/draft",
    {
      schema: ROUTES_CONFIG.submitDraftDemande,
      preHandler: hasPermissionHandler("intentions/ecriture"),
    },
    async (request, response) => {
      const { demande } = request.body;
      if (!request.user) throw Boom.unauthorized();

      const result = await submitDraftDemande({
        demande,
        user: request.user,
      });
      response.status(200).send(result);
    }
  );

  server.get(
    "/demande/:id",
    {
      schema: ROUTES_CONFIG.getDemande,
      preHandler: hasPermissionHandler("intentions/lecture"),
    },
    async (request, response) => {
      const user = request.user;
      if (!user) throw Boom.forbidden();
      const demande = await findDemande({ id: request.params.id, user });
      if (!demande) return response.status(404).send();

      const scope = getPermissionScope(user.role, "intentions/ecriture");
      const canEdit = guardScope(scope?.default, {
        user: () => user.id === demande.createurId,
        region: () => user.codeRegion === demande.codeRegion,
        national: () => true,
      });

      response.status(200).send({ ...demande, canEdit });
    }
  );

  server.delete(
    "/demande/:id",
    {
      schema: ROUTES_CONFIG.deleteDemande,
      preHandler: hasPermissionHandler("intentions/ecriture"),
    },
    async (request, response) => {
      const user = request.user;
      if (!user) throw Boom.forbidden();
      await deleteDemande({ id: request.params.id, user });
      response.status(200).send();
    }
  );

  server.get(
    "/demandes",
    {
      schema: ROUTES_CONFIG.getDemandes,
      preHandler: hasPermissionHandler("intentions/lecture"),
    },
    async (request, response) => {
      const { order, orderBy, ...rest } = request.query;
      if (!request.user) throw Boom.forbidden();

      const result = await findDemandes({
        ...rest,
        user: request.user,
        orderBy: order && orderBy ? { order, column: orderBy } : undefined,
      });
      response.status(200).send(result);
    }
  );

  server.get(
    "/demandes/csv",
    {
      schema: ROUTES_CONFIG.getDemandesCsv,
      preHandler: hasPermissionHandler("intentions/lecture"),
    },
    async (request, response) => {
      const { order, orderBy, ...rest } = request.query;
      if (!request.user) throw Boom.forbidden();

      const { demandes } = await findDemandes({
        ...rest,
        user: request.user,
        offset: 0,
        limit: 1000000,
        orderBy: order && orderBy ? { order, column: orderBy } : undefined,
      });

      const parser = new Parser({
        fields: Object.entries(DEMANDES_COLUMNS).map(([value, label]) => ({
          label,
          value,
        })),
        delimiter: ";",
      });
      const csv = parser.parse(demandes);
      response
        .status(200)
        .header("Content-Type", "text/csv")
        .header(
          "Content-Disposition",
          `attachment; filename=${"demandes_export"}.csv`
        )
        .send(csv);
    }
  );

  server.get(
    "/demandes/count",
    {
      schema: ROUTES_CONFIG.countDemandes,
      preHandler: hasPermissionHandler("intentions/lecture"),
    },
    async (request, response) => {
      if (!request.user) throw Boom.forbidden();

      const result = await countDemandes({
        user: request.user,
      });
      response.status(200).send(result);
    }
  );

  server.get(
    "/demandes/stats",
    {
      schema: ROUTES_CONFIG.getStatsDemandes,
      preHandler: hasPermissionHandler("intentions/lecture"),
    },
    async (request, response) => {
      const { order, orderBy, ...rest } = request.query;
      if (!request.user) throw Boom.forbidden();

      const result = await getStatsDemandes({
        ...rest,
        orderBy: order && orderBy ? { order, column: orderBy } : undefined,
        user: request.user,
      });
      response.status(200).send(result);
    }
  );

  server.get(
    "/demandes/stats/csv",
    {
      schema: ROUTES_CONFIG.getStatsDemandesCsv,
      preHandler: hasPermissionHandler("intentions/lecture"),
    },
    async (request, response) => {
      const { order, orderBy, ...rest } = request.query;
      if (!request.user) throw Boom.forbidden();

      const { demandes } = await getStatsDemandes({
        ...rest,
        user: request.user,
        offset: 0,
        limit: 1000000,
        orderBy: order && orderBy ? { order, column: orderBy } : undefined,
      });

      const parser = new Parser({
        fields: Object.entries(STATS_DEMANDES_COLUMNS).map(
          ([value, label]) => ({
            label,
            value,
          })
        ),
        delimiter: ";",
      });
      const csv = parser.parse(demandes);
      response
        .status(200)
        .header("Content-Type", "text/csv")
        .header(
          "Content-Disposition",
          `attachment; filename=${"demandes_stats_export"}.csv`
        )
        .send(csv);
    }
  );

  server.get(
    "/demandes/stats/count",
    {
      schema: ROUTES_CONFIG.countStatsDemandes,
      preHandler: hasPermissionHandler("intentions/lecture"),
    },
    async (request, response) => {
      const { ...filters } = request.query;
      if (!request.user) throw Boom.forbidden();

      const result = await countStatsDemandes({
        ...filters,
        user: request.user,
      });
      response.status(200).send(result);
    }
  );
};
