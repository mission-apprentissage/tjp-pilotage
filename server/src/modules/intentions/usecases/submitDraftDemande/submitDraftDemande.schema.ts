import { z } from "zod";

export const submitDraftDemandeSchema = {
  body: z.object({
    demande: z.object({
      id: z.string().optional(),
      uai: z.string(),
      cfd: z.string(),
      dispositifId: z.string(),
      libelleFCIL: z.string().optional(),
      rentreeScolaire: z.coerce.number(),
      typeDemande: z.string(),
      compensationUai: z.string().optional(),
      compensationCfd: z.string().optional(),
      compensationDispositifId: z.string().optional(),
      compensationRentreeScolaire: z.coerce.number().optional(),
      motif: z.array(z.string()),
      autreMotif: z.string().optional(),
      libelleColoration: z.string().optional(),
      coloration: z.boolean(),
      amiCma: z.boolean(),
      poursuitePedagogique: z.boolean().optional(),
      commentaire: z.string().optional(),
      mixte: z.boolean().optional(),
      capaciteScolaireActuelle: z.coerce.number().optional(),
      capaciteScolaire: z.coerce.number().optional(),
      capaciteScolaireColoree: z.coerce.number().optional(),
      capaciteApprentissageActuelle: z.coerce.number().optional(),
      capaciteApprentissage: z.coerce.number().optional(),
      capaciteApprentissageColoree: z.coerce.number().optional(),
      status: z.enum(["draft", "submitted", "refused"]),
    }),
  }),
  response: {
    200: z.object({ id: z.string() }),
  },
};
