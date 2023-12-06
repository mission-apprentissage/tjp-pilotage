import { z } from "zod";

const EtablissementMetadataSchema = z
  .object({
    libelle: z.string().optional(),
    commune: z.string().optional(),
  })
  .optional();

const FormationMetadataSchema = z
  .object({
    libelle: z.string().optional(),
    isFCIL: z.boolean().optional(),
    dispositifs: z
      .array(
        z.object({
          codeDispositif: z.string().optional(),
          libelleDispositif: z.string().optional(),
        })
      )
      .optional(),
  })
  .optional();

const MetadataSchema = z.object({
  etablissement: EtablissementMetadataSchema,
  formation: FormationMetadataSchema,
  etablissementCompensation: EtablissementMetadataSchema,
  formationCompensation: FormationMetadataSchema,
});

const DemandeSchema = z.object({
  id: z.string(),
  createdAt: z.string(),
  status: z.enum(["draft", "submitted", "refused"]),
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
});

export const getDemandeSchema = {
  params: z.object({ id: z.string() }),
  response: {
    200: DemandeSchema.partial().merge(
      z.object({
        metadata: MetadataSchema,
        canEdit: z.boolean(),
      })
    ),
  },
};
