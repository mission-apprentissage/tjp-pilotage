import { MultipartFile } from "@fastify/multipart";
import { demandeStatut } from "shared/enum/demandeStatutEnum";
import { z } from "zod";

export const demandeSchema = z.object({
  numero: z.string().optional(),
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
  besoinRH: z.array(z.string()).optional(),
  autreBesoinRH: z.string().optional(),
  libelleColoration: z.string().optional(),
  coloration: z.boolean(),
  amiCma: z.boolean(),
  amiCmaValide: z.boolean().optional(),
  amiCmaValideAnnee: z.string().optional(),
  poursuitePedagogique: z.boolean().optional(),
  commentaire: z.string().optional(),
  mixte: z.boolean().optional(),
  capaciteScolaireActuelle: z.coerce.number().optional(),
  capaciteScolaire: z.coerce.number().optional(),
  capaciteScolaireColoree: z.coerce.number().optional(),
  capaciteApprentissageActuelle: z.coerce.number().optional(),
  capaciteApprentissage: z.coerce.number().optional(),
  capaciteApprentissageColoree: z.coerce.number().optional(),
  statut: z.enum(["draft", "submitted", "refused"]),
  motifRefus: z.array(z.string()).optional(),
  autreMotifRefus: z.string().optional(),
  recrutementRH: z.boolean().optional(),
  nbRecrutementRH: z.coerce.number().optional(),
  discipline1RecrutementRH: z.string().optional(),
  discipline2RecrutementRH: z.string().optional(),
  reconversionRH: z.boolean().optional(),
  nbReconversionRH: z.coerce.number().optional(),
  discipline1ReconversionRH: z.string().optional(),
  discipline2ReconversionRH: z.string().optional(),
  professeurAssocieRH: z.boolean().optional(),
  nbProfesseurAssocieRH: z.coerce.number().optional(),
  discipline1ProfesseurAssocieRH: z.string().optional(),
  discipline2ProfesseurAssocieRH: z.string().optional(),
  formationRH: z.boolean().optional(),
  nbFormationRH: z.coerce.number().optional(),
  discipline1FormationRH: z.string().optional(),
  discipline2FormationRH: z.string().optional(),
  campagneId: z.string(),
});

export interface BodyProperty {
  encoding: string;
  fieldname: string;
  type: "file" | "field";
  value?: string;
  filename?: string;
  mimetype: string;
  file?: Promise<MultipartFile | undefined>;
  files?: AsyncIterableIterator<MultipartFile>;
  toBuffer?: () => Promise<Buffer>;
}

export const propertySchema = z.object({
  encoding: z.string(),
  fieldname: z.string(),
  type: z.enum(["file", "field"]),
  value: z.string().optional(),
  filename: z.string().optional(),
  mimetype: z.string(),
  file: z.custom<NodeJS.ReadableStream>().optional(),
});

export const submitDemandeSchema = {
  body: z.any(),
  response: {
    200: z.object({
      id: z.string(),
      statut: demandeStatut,
    }),
  },
};
