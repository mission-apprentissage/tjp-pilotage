//@ts-ignore
import { Parser } from "@json2csv/plainjs";
import { ROUTES_CONFIG } from "shared";

import { Server } from "../../../server";
import { getFormations } from "../usecases/getFormations/getFormations.usecase";
export const formationsRoutes = ({ server }: { server: Server }) => {
  server.get(
    "/formations",
    { schema: ROUTES_CONFIG.getFormations },
    async (request, response) => {
      const { order, orderBy, ...rest } = request.query;
      const formations = await getFormations({
        ...rest,
        orderBy: order && orderBy ? { order, column: orderBy } : undefined,
      });
      //@ts-ignore
      response.status(200).send(formations);
    }
  );

  server.get(
    "/formations/csv",
    { schema: ROUTES_CONFIG.getFormationsCsv },
    async (request, response) => {
      const { order, orderBy, ...rest } = request.query;
      const formations = await getFormations({
        ...rest,
        offset: 0,
        limit: 1000000,
        orderBy: order && orderBy ? { order, column: orderBy } : undefined,
      });
      const parser = new Parser();
      const csv = parser.parse(formations.formations);
      response
        .status(200)
        .header("Content-Type", "text/csv")
        .header(
          "Content-Disposition",
          `attachment; filename=${"formations_export"}.csv`
        )
        .send(csv);
    }
  );
};
