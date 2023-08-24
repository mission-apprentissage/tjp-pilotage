import { Type } from "@sinclair/typebox";

export const intentionsSchemas = {
  checkUai: {
    params: Type.Object({
      uai: Type.String(),
    }),
    response: {
      200: Type.Union([
        Type.Object({
          status: Type.Union([Type.Literal("valid")]),
          data: Type.Object({
            uai: Type.String(),
            libelle: Type.Optional(Type.String()),
            codeRegion: Type.Optional(Type.String()),
            codeAcademie: Type.Optional(Type.String()),
            codeDepartement: Type.Optional(Type.String()),
            commune: Type.Optional(Type.String()),
            secteur: Type.Optional(Type.String()),
            adresse: Type.Optional(Type.String()),
          }),
        }),
        Type.Object({
          status: Type.Union([Type.Literal("wrong_format")]),
          suggestions: Type.Array(
            Type.Object({
              uai: Type.String(),
              commune: Type.String(),
              libelle: Type.String(),
            })
          ),
        }),
        Type.Object({
          status: Type.Union([Type.Literal("not_found")]),
        }),
      ]),
    },
  },
  checkCfd: {
    params: Type.Object({
      cfd: Type.String(),
    }),
    response: {
      200: Type.Union([
        Type.Object({
          status: Type.Union([Type.Literal("valid")]),
          data: Type.Object({
            cfd: Type.String(),
            libelle: Type.Optional(Type.String()),
          }),
        }),
        Type.Object({
          status: Type.Union([Type.Literal("wrong_format")]),
        }),
        Type.Object({
          status: Type.Union([Type.Literal("not_found")]),
        }),
      ]),
    },
  },
} as const;
