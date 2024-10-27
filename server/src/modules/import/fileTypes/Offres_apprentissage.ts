import { z } from "zod";

export const OffresApprentissageSchema = z
  .object({
    "UAI formation": z.string().optional(),
    "UAI Responsable": z.string().optional(),
    "UAI formateur": z.string().optional(),
    "Code du diplome ou du titre suivant la nomenclature de l'Education nationale (CodeEN)": z.string(),
    "Niveau de la formation": z.string(),
    Tags: z.string(),
  })
  .superRefine((data, ctx) => {
    if (
      typeof data["UAI formation"] === "undefined" &&
      typeof data["UAI formateur"] === "undefined" &&
      typeof data["UAI Responsable"] === "undefined"
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.invalid_type,
        message: "UAI formation or UAI formateur or UAI Responsable Required",
        path: ["UAI formation", "UAI formateur", "UAI Responsable"],
        expected: "string",
        received: "undefined",
      });
    }
  });

export type Offres_apprentissage = z.infer<typeof OffresApprentissageSchema>;
