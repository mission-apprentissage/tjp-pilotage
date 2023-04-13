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
          codeRegion: Type.Optional(Type.String()),
          cfd: Type.Optional(Type.String()),
          codeAcademie: Type.Optional(Type.String()),
          codeDepartement: Type.Optional(Type.String()),
          commune: Type.Optional(Type.String()),
          codeDiplome: Type.Optional(Type.String()),
          codeDispositif: Type.Optional(Type.String()),
          cfdFamille: Type.Optional(Type.String()),
          order: Type.Optional(
            Type.Union([Type.Literal("asc"), Type.Literal("desc")])
          ),
          orderBy: Type.Optional(
            Type.Union([
              Type.Literal("effectif"),
              Type.Literal("nbEtablissement"),
            ])
          ),
        }),
        response: {
          200: Type.Object({
            count: Type.Number(),
            formations: Type.Array(
              Type.Object({
                codeFormationDiplome: Type.String(),
                libelleDiplome: Type.String(),
                codeNiveauDiplome: Type.String(),
                dateOuverture: Type.Optional(Type.String()),
                dateFermeture: Type.Optional(Type.String()),
                libelleOfficielFamille: Type.Optional(Type.String()),
                libelleDispositif: Type.Optional(Type.String()),
                libelleNiveauDiplome: Type.String(),
                nbEtablissement: Type.Optional(Type.Number()),
                effectif: Type.Optional(Type.Number()),
                nbInsertion6mois: Type.Optional(Type.Number()),
                nbPoursuiteEtudes: Type.Optional(Type.Number()),
                effectifSortie: Type.Optional(Type.Number()),
                nbSortants: Type.Optional(Type.Number()),
              })
            ),
          }),
        },
      },
    },
    async (request, response) => {
      const {
        offset,
        limit,
        codeRegion,
        cfd,
        cfdFamille,
        codeAcademie,
        codeDepartement,
        codeDiplome,
        codeDispositif,
        commune,
        order,
        orderBy,
      } = request.query;
      const formations = await getFormations({
        offset,
        limit,
        codeRegion,
        cfd,
        orderBy: order && orderBy ? { order, column: orderBy } : undefined,
      });
      //@ts-ignore
      response.status(200).send(formations);
    }
  );
};
