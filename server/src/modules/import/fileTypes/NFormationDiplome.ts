import { z } from "zod";

// Erreur si pas DATE_OUVERTURE et pas DATE_FERMETURE
export const NFormationDiplomeSchema = z
  .object({
    LIBELLE_LONG_200: z.string(),
    FORMATION_DIPLOME: z.string(),
    DATE_OUVERTURE: z.string().optional(),
    DATE_FERMETURE: z.string().optional(),
    ANCIEN_DIPLOME_1: z.string().optional(),
    ANCIEN_DIPLOME_2: z.string().optional(),
    ANCIEN_DIPLOME_3: z.string().optional(),
    ANCIEN_DIPLOME_4: z.string().optional(),
    ANCIEN_DIPLOME_5: z.string().optional(),
    ANCIEN_DIPLOME_6: z.string().optional(),
    ANCIEN_DIPLOME_7: z.string().optional(),
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

export type NFormationDiplomeLine = z.infer<typeof NFormationDiplomeSchema>;
