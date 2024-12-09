import { z } from "zod";

export const VFormationDiplomeSchema = z
  .object({
    FORMATION_DIPLOME: z.string(),
    LIBELLE_LONG_200: z.string(),
    DATE_OUVERTURE: z.string().optional(),
    DATE_FERMETURE: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (typeof data.DATE_OUVERTURE === "undefined" && typeof data.DATE_FERMETURE === "undefined") {
      ctx.addIssue({
        code: z.ZodIssueCode.invalid_type,
        message: "DATE_OUVERTURE or DATE_FERMETURE Required",
        path: ["DATE_OUVERTURE", "DATE_FERMETURE"],
        expected: "string",
        received: "undefined",
      });
    }
  });

export type VFormationDiplomeLine = z.infer<typeof VFormationDiplomeSchema>;
