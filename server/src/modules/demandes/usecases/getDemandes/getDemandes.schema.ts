import { DemandeStatutZodType } from "shared/enum/demandeStatutEnum";
import { z } from "zod";

const DemandesItem = z.object({
  numero: z.string(),
  cfd: z.string().optional(),
  libelleFormation: z.string().optional(),
  libelleEtablissement: z.string().optional(),
  codeDepartement: z.string().optional(),
  libelleDepartement: z.string().optional(),
  codeAcademie: z.string().optional(),
  libelleAcademie: z.string().optional(),
  codeRegion: z.string(),
  libelleRegion: z.string().optional(),
  libelleDispositif: z.string().optional(),
  libelleFCIL: z.string().optional(),
  uai: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
  createurId: z.string(),
  statut: z.string(),
  typeDemande: z.string().optional(),
  compensationCfd: z.string().optional(),
  compensationCodeDispositif: z.string().optional(),
  compensationUai: z.string().optional(),
  compensationRentreeScolaire: z.coerce.number().optional(),
  numeroCompensation: z.string().optional(),
  typeCompensation: z.string().optional(),
  codeDispositif: z.string().optional(),
  rentreeScolaire: z.coerce.number().optional(),
  motif: z.array(z.string()).optional(),
  autreMotif: z.string().optional(),
  libelleColoration: z.string().optional(),
  coloration: z.boolean().optional(),
  amiCma: z.boolean().optional(),
  amiCmaValide: z.boolean().optional(),
  amiCmaValideAnnee: z.string().optional(),
  amiCmaEnCoursValidation: z.boolean().optional(),
  poursuitePedagogique: z.boolean().optional(),
  commentaire: z.string().optional(),
  mixte: z.boolean().optional(),
  capaciteScolaireActuelle: z.coerce.number().optional(),
  capaciteScolaire: z.coerce.number().optional(),
  capaciteScolaireColoree: z.coerce.number().optional(),
  capaciteApprentissageActuelle: z.coerce.number().optional(),
  capaciteApprentissage: z.coerce.number().optional(),
  capaciteApprentissageColoree: z.coerce.number().optional(),
  userName: z.string().optional(),
  numeroDemandeImportee: z.string().optional(),
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
});

export const getDemandesSchema = {
  querystring: z.object({
    statut: DemandeStatutZodType.exclude(["supprimée"]).optional(),
    search: z.string().optional(),
    order: z.enum(["asc", "desc"]).optional(),
    orderBy: DemandesItem.keyof().optional(),
    offset: z.coerce.number().optional(),
    limit: z.coerce.number().optional(),
    campagne: z.string().optional(),
  }),
  response: {
    200: z.object({
      count: z.coerce.number(),
      demandes: z.array(DemandesItem),
      campagnes: z.array(
        z.object({
          annee: z.string(),
          statut: z.string(),
        })
      ),
      currentCampagne: z.object({
        annee: z.string(),
        statut: z.string(),
        id: z.string(),
      }),
      campagne: z.object({
        annee: z.string(),
        statut: z.string(),
        id: z.string(),
      }),
    }),
  },
};
