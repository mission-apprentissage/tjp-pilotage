import { Type } from "@sinclair/typebox";

import { Server } from "../../../server";
import { getFormations } from "../usecases/getFormations/getFormations.usecase";

export const formationsRoutes = ({ server }: { server: Server }) => {
  server.get(
    "/formations",
    {
      schema: {
        querystring: Type.Object({
          offset: Type.Optional(Type.Number()),
          limit: Type.Optional(Type.Number()),
        }),
        response: {
          200: Type.Object({
            formations: Type.Array(
              Type.Object({
                id: Type.String(),
                codeFormationDiplome: Type.String(),
                rncp: Type.Optional(Type.Number()),
                libelleDiplome: Type.String(),
                codeNiveauDiplome: Type.String(),
                // dateOuverture: Type.String(),
                // dateFermeture: Type.String(),
                dispositifId: Type.String(),
                nbEtablissement: Type.Number(),
                effectif: Type.Number(),
              })
            ),
          }),
        },
      },
    },
    async (request, response) => {
      const { offset, limit } = request.query;
      const formations = await getFormations({ offset, limit });
      response.status(200).send({ formations });
    }
  );
};
