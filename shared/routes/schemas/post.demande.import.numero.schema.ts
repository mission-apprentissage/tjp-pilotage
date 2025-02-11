import { z } from "zod";

import { DemandeStatutZodType } from "../../enum/demandeStatutEnum";

const EtablissementMetadataSchema = z
  .object({
    libelleEtablissement: z.string().optional(),
    commune: z.string().optional(),
  })
  .optional();

const FormationMetadataSchema = z
  .object({
    libelleFormation: z.string().optional(),
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
});

const DemandeSchema = z.object({
  numero: z.string(),
  createdAt: z.string(),
  statut: DemandeStatutZodType.optional(),
  uai: z.string(),
  cfd: z.string(),
  codeDispositif: z.string(),
  libelleFCIL: z.string().optional(),
  rentreeScolaire: z.coerce.number(),
  typeDemande: z.string(),
  compensationUai: z.string().optional(),
  compensationCfd: z.string().optional(),
  compensationCodeDispositif: z.string().optional(),
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
  motifRefus: z.array(z.string()).optional(),
  autreMotifRefus: z.string().optional(),
});

export const importDemandeSchema = {
  params: z.object({ numero: z.string() }),
  response: {
    200: DemandeSchema.partial().merge(
      z.object({
        metadata: MetadataSchema,
      })
    ),
  },
};
