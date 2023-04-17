//@ts-ignore
import { Parser } from "@json2csv/plainjs";
import { ROUTES_CONFIG } from "shared";

import { Server } from "../../../server";
import { getEtablissements } from "../usecases/getEtablissements/getEtablissements.usecase";
export const etablissementsRoutes = ({ server }: { server: Server }) => {
  server.get(
    "/etablissements",
    { schema: ROUTES_CONFIG.getEtablissements },
    async (request, response) => {
      const { order, orderBy, ...rest } = request.query;
      const etablissements = await getEtablissements({
        ...rest,
        orderBy: order && orderBy ? { order, column: orderBy } : undefined,
      });
      response.status(200).send(etablissements);
    }
  );

  server.get(
    "/etablissements/csv",
    { schema: ROUTES_CONFIG.getEtablissementsCsv },
    async (request, response) => {
      const { order, orderBy, ...rest } = request.query;
      const etablissements = await getEtablissements({
        ...rest,
        offset: 0,
        limit: 1000000,
        orderBy: order && orderBy ? { order, column: orderBy } : undefined,
      });
      const parser = new Parser();
      const csv = parser.parse(etablissements.etablissements);
      response
        .status(200)
        .header("Content-Type", "text/csv")
        .header(
          "Content-Disposition",
          `attachment; filename=${"etablissements_export"}.csv`
        )
        .send(csv);
    }
  );
};
