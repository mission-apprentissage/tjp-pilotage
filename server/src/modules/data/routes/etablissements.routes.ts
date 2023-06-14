//@ts-ignore
import { Parser } from "@json2csv/plainjs";
import { ETABLISSEMENTS_COLUMNS, ROUTES_CONFIG } from "shared";

import { Server } from "../../../server";
import { getEtablissement } from "../queries/getEtablissement/getEtablissement.query";
import { getEtablissements } from "../usecases/getEtablissements/getEtablissements.usecase";
import { getEtablissementsList } from "../usecases/getEtablissementsList/getEtablissementsList.usecase";
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
      const parser = new Parser({
        fields: Object.entries(ETABLISSEMENTS_COLUMNS).map(
          ([value, label]) => ({
            label,
            value,
          })
        ),
      });
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

  server.get(
    "/etablissements/list",
    { schema: ROUTES_CONFIG.getEtablissementsList },
    async (_, response) => {
      const etablissements = await getEtablissementsList();
      response.status(200).send(etablissements);
    }
  );

  server.get(
    "/etablissement/:uai",
    { schema: ROUTES_CONFIG.getEtablissement },
    async (request, response) => {
      const { uai } = request.params;
      const etablissement = await getEtablissement({ uai });
      if (!etablissement) return response.status(404).send();
      response.status(200).send(etablissement);
    }
  );
};
