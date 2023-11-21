import { z } from "zod";

const OptionSchema = z.object({
  label: z.coerce.string(),
  value: z.coerce.string(),
});

const StatsDemandesItem = z.object({
  id: z.string(),
  cfd: z.string().optional(),
  libelleDiplome: z.string().optional(),
  dispositifId: z.string().optional(),
  libelleDispositif: z.string().optional(),
  niveauDiplome: z.string().optional(),
  uai: z.string().optional(),
  libelleEtablissement: z.string().optional(),
  commune: z.string().optional(),
  rentreeScolaire: z.coerce.number().optional(),
  typeDemande: z.string().optional(),
  motif: z.array(z.string()).optional(),
  autreMotif: z.string().optional(),
  coloration: z.boolean().optional(),
  libelleColoration: z.string().optional(),
  libelleFCIL: z.string().optional(),
  amiCma: z.boolean().optional(),
  poursuitePedagogique: z.boolean().optional(),
  commentaire: z.string().optional(),
  libelleFiliere: z.string().optional(),
  status: z.string(),
  codeRegion: z.string().optional(),
  libelleRegion: z.string().optional(),
  codeAcademie: z.string().optional(),
  codeDepartement: z.string().optional(),
  libelleDepartement: z.string().optional(),
  createdAt: z.string(),
  compensationCfd: z.string().optional(),
  compensationDispositifId: z.string().optional(),
  compensationUai: z.string().optional(),
  differenceCapaciteScolaire: z.coerce.number().optional(),
  capaciteScolaireActuelle: z.coerce.number().optional(),
  capaciteScolaire: z.coerce.number().optional(),
  capaciteScolaireColoree: z.coerce.number().optional(),
  differenceCapaciteApprentissage: z.coerce.number().optional(),
  capaciteApprentissageActuelle: z.coerce.number().optional(),
  capaciteApprentissage: z.coerce.number().optional(),
  capaciteApprentissageColoree: z.coerce.number().optional(),
  tauxInsertion: z.coerce.number().optional(),
  tauxPoursuite: z.coerce.number().optional(),
  devenirFavorable: z.coerce.number().optional(),
  pression: z.coerce.number().optional(),
  nbEtablissement: z.coerce.number().optional(),
  positionQuadrant: z.string().optional(),
  tauxInsertionMoyen: z.coerce.number().optional(),
  tauxPoursuiteMoyen: z.coerce.number().optional(),
});

export const getRestitutionIntentionsStatsSchema = {
  querystring: z.object({
    codeRegion: z.array(z.string()).optional(),
    codeAcademie: z.array(z.string()).optional(),
    codeDepartement: z.array(z.string()).optional(),
    commune: z.array(z.string()).optional(),
    uai: z.array(z.string()).optional(),
    rentreeScolaire: z.string().optional(),
    typeDemande: z.array(z.string()).optional(),
    motif: z.array(z.string()).optional(),
    status: z.enum(["draft", "submitted"]).optional(),
    codeNiveauDiplome: z.array(z.string()).optional(),
    cfd: z.array(z.string()).optional(),
    dispositif: z.array(z.string()).optional(),
    filiere: z.array(z.string()).optional(),
    cfdFamille: z.array(z.string()).optional(),
    coloration: z.string().optional(),
    amiCMA: z.string().optional(),
    secteur: z.string().optional(),
    compensation: z.string().optional(),
    positionQuadrant: z.string().optional(),
    order: z.enum(["asc", "desc"]).optional(),
    orderBy: StatsDemandesItem.keyof().optional(),
    offset: z.coerce.number().optional(),
    limit: z.coerce.number().optional(),
  }),
  response: {
    200: z.object({
      filters: z.object({
        rentreesScolaires: z.array(OptionSchema),
        statuts: z.array(OptionSchema),
        regions: z.array(OptionSchema),
        academies: z.array(OptionSchema),
        departements: z.array(OptionSchema),
        communes: z.array(OptionSchema),
        etablissements: z.array(OptionSchema),
        typesDemande: z.array(OptionSchema),
        motifs: z.array(OptionSchema),
        status: z.array(OptionSchema),
        diplomes: z.array(OptionSchema),
        formations: z.array(OptionSchema),
        filieres: z.array(OptionSchema),
        familles: z.array(OptionSchema),
        dispositifs: z.array(OptionSchema),
        secteurs: z.array(OptionSchema),
        amiCMAs: z.array(OptionSchema),
        colorations: z.array(OptionSchema),
        compensations: z.array(OptionSchema),
      }),
      demandes: z.array(StatsDemandesItem),
      count: z.coerce.number(),
    }),
  },
};
