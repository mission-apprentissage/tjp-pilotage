import { z } from "zod";

export const OffresApprentissageSchema = z
  .object({
    "Lieu: UAI": z.string().optional(),
    "Responsable: UAI": z.string().optional(),
    "Formateur: UAI": z.string().optional(),
    "Formation: code CFD": z.string(),
    "Formation: niveau BCN": z.string(),
    // Rentrées scolaires effectives
    "Offre: Tags": z.string(),
    "Formation: codes MEF": z.string().optional(),
    "Formation: durée collectée": z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (
      typeof data["Lieu: UAI"] === "undefined" &&
      typeof data["Formateur: UAI"] === "undefined" &&
      typeof data["Responsable: UAI"] === "undefined"
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.invalid_type,
        message: "'Lieu: UAI' or 'Formateur: UAI' or 'Responsable: UAI' Required",
        path: ["Lieu: UAI", "Formateur: UAI", "Responsable: UAI"],
        expected: "string",
        received: "undefined",
      });
    }
  });

export type Offres_apprentissage = z.infer<typeof OffresApprentissageSchema>;
