export const defaultIntentionForms: PartialIntentionForms = {};

export type PartialIntentionForms = Partial<IntentionForms>;

export type IntentionForms = {
  // Formation et établissement
  uai: string;
  cfd: string;
  codeDispositif: string;
  libelleFCIL?: string;
  // Type de demande
  rentreeScolaire: number;
  typeDemande: string;
  coloration: boolean;
  libelleColoration?: string;
  // Capacité
  mixte: boolean;
  capaciteScolaireActuelle?: number;
  capaciteScolaire?: number;
  capaciteScolaireColoree?: number;
  capaciteApprentissageActuelle?: number;
  capaciteApprentissage?: number;
  capaciteApprentissageColoree?: number;
  // Précisions
  motif: string[];
  autreMotif?: string;
  amiCma: boolean;
  amiCmaValide?: boolean;
  amiCmaValideAnnee?: string;
  amiCmaValideEnCours?: boolean;
  partenairesEconomiquesImpliques: boolean;
  partenaireEconomique1?: string;
  partenaireEconomique2?: string;
  cmqImplique: boolean;
  filiereCmq?: string;
  nomCmq?: string;
  //RH
  recrutementRH: boolean;
  nbRecrutementRH?: number;
  discipline1RecrutementRH?: string;
  discipline2RecrutementRH?: string;
  reconversionRH: boolean;
  nbReconversionRH?: number;
  discipline1ReconversionRH?: string;
  discipline2ReconversionRH?: string;
  professeurAssocieRH: boolean;
  nbProfesseurAssocieRH?: number;
  discipline1ProfesseurAssocieRH?: string;
  discipline2ProfesseurAssocieRH?: string;
  formationRH: boolean;
  nbFormationRH?: number;
  discipline1FormationRH?: string;
  discipline2FormationRH?: string;
  besoinRHPrecisions?: string;
  // Travaux et équipements
  travauxAmenagement: boolean;
  travauxAmenagementDescription?: string;
  travauxAmenagementParEtablissement?: boolean;
  travauxAmenagementReseaux?: boolean;
  travauxAmenagementReseauxDescription?: string;
  achatEquipement: boolean;
  achatEquipementDescription?: string;
  coutEquipement?: number;
  equipementPrecisions?: string;
  // Internat et restauration
  augmentationCapaciteAccueilHebergement: boolean;
  augmentationCapaciteAccueilHebergementPlaces?: number;
  augmentationCapaciteAccueilHebergementPrecision?: boolean;
  augmentationCapaciteAccueilHebergementPrecisions?: string;
  augmentationCapaciteAccueilRestauration: boolean;
  augmentationCapaciteAccueilRestaurationPlaces?: number;
  augmentationCapaciteAccueilRestaurationPrecision?: boolean;
  augmentationCapaciteAccueilRestaurationPrecisions?: string;
  // Observations / commentaires
  commentaire?: string;
  // Statut
  statut: "draft" | "submitted" | "refused";
  motifRefus?: string[];
  autreMotifRefus?: string;
  // Hidden
  campagneId: string;
};
