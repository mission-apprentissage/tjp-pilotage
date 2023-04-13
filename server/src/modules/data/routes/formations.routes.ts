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
          cfd: Type.Optional(Type.Array(Type.String())),
          codeRegion: Type.Optional(Type.Array(Type.String())),
          codeAcademie: Type.Optional(Type.Array(Type.String())),
          codeDepartement: Type.Optional(Type.Array(Type.String())),
          commune: Type.Optional(Type.Array(Type.String())),
          codeDiplome: Type.Optional(Type.Array(Type.String())),
          codeDispositif: Type.Optional(Type.Array(Type.String())),
          cfdFamille: Type.Optional(Type.Array(Type.String())),
          order: Type.Optional(
            Type.Union([Type.Literal("asc"), Type.Literal("desc")])
          ),
          orderBy: Type.Optional(
            Type.Union([
              Type.Literal("libelleDiplome"),
              Type.Literal("effectif"),
              Type.Literal("nbEtablissement"),
              Type.Literal("tauxInsertion6mois"),
              Type.Literal("tauxPoursuiteEtudes"),
            ])
          ),
        }),
        response: {
          200: Type.Object({
            count: Type.Number(),
            filters: Type.Any(),
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
                tauxInsertion6mois: Type.Optional(Type.Number()),
                tauxPoursuiteEtudes: Type.Optional(Type.Number()),
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
        codeAcademie,
        codeDepartement,
        codeDiplome,
        codeDispositif,
        commune,
        cfd,
        cfdFamille,
        order,
        orderBy,
      } = request.query;

      const formations = await getFormations({
        offset,
        limit,
        codeRegion,
        codeAcademie,
        codeDepartement,
        codeDiplome,
        codeDispositif,
        commune,
        cfd,
        cfdFamille,
        orderBy: order && orderBy ? { order, column: orderBy } : undefined,
      });
      //@ts-ignore
      response.status(200).send(formations);
    }
  );
};
