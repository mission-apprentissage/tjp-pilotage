import type { DemandeStatutType } from "shared/enum/demandeStatutEnum";
import type { TypeDemandeType } from "shared/enum/demandeTypeEnum";
import type {RaisonCorrectionType} from 'shared/enum/raisonCorrectionEnum';

export type PartialDemandeFormType = Partial<DemandeFormType>;

export type DemandeFormType = {
  // Formation et établissement
  uai: string;
  cfd: string;
  codeDispositif: string;
  libelleFCIL?: string;
  // Type de demande
  rentreeScolaire: number;
  typeDemande: TypeDemandeType;
  coloration: boolean;
  libelleColoration?: string;
  // Capacité
  mixte: boolean;
  capaciteScolaireActuelle?: number;
  capaciteScolaire?: number;
  capaciteScolaireColoreeActuelle?: number;
  capaciteScolaireColoree?: number;
  capaciteApprentissageActuelle?: number;
  capaciteApprentissage?: number;
  capaciteApprentissageColoreeActuelle?: number;
  capaciteApprentissageColoree?: number;
  // Précisions
  motif?: string[];
  autreMotif?: string;
  amiCma?: boolean;
  amiCmaValide?: boolean;
  amiCmaValideAnnee?: string;
  amiCmaEnCoursValidation?: boolean;
  partenairesEconomiquesImpliques?: boolean;
  partenaireEconomique1?: string;
  partenaireEconomique2?: string;
  cmqImplique?: boolean;
  filiereCmq?: string;
  nomCmq?: string;
  inspecteurReferent?: string;
  //RH
  recrutementRH?: boolean;
  nbRecrutementRH?: number;
  discipline1RecrutementRH?: string;
  discipline2RecrutementRH?: string;
  reconversionRH: boolean;
  nbReconversionRH?: number;
  discipline1ReconversionRH?: string;
  discipline2ReconversionRH?: string;
  professeurAssocieRH?: boolean;
  nbProfesseurAssocieRH?: number;
  discipline1ProfesseurAssocieRH?: string;
  discipline2ProfesseurAssocieRH?: string;
  formationRH?: boolean;
  nbFormationRH?: number;
  discipline1FormationRH?: string;
  discipline2FormationRH?: string;
  besoinRHPrecisions?: string;
  // Travaux et équipements
  travauxAmenagement?: boolean;
  travauxAmenagementCout?: number;
  travauxAmenagementDescription?: string;
  achatEquipement?: boolean;
  achatEquipementCout?: number;
  achatEquipementDescription?: string;
  // Internat et restauration
  augmentationCapaciteAccueilHebergement?: boolean;
  augmentationCapaciteAccueilHebergementPlaces?: number;
  augmentationCapaciteAccueilHebergementPrecisions?: string;
  augmentationCapaciteAccueilRestauration?: boolean;
  augmentationCapaciteAccueilRestaurationPlaces?: number;
  augmentationCapaciteAccueilRestaurationPrecisions?: string;
  // Observations / commentaires
  commentaire?: string;
  // Statut
  statut: Exclude<DemandeStatutType, "supprimée">;
  motifRefus?: string[];
  autreMotifRefus?: string;
  // Hidden
  campagneId: string;
};

export type PartialCorrectionFormType = Partial<CorrectionFormType>;

export type CorrectionFormType = {
  demandeNumero: string;
  // Capacité
  capaciteScolaireActuelle: number;
  capaciteScolaire: number;
  capaciteScolaireColoreeActuelle: number;
  capaciteScolaireColoree: number;
  capaciteApprentissageActuelle: number;
  capaciteApprentissage: number;
  capaciteApprentissageColoreeActuelle: number;
  capaciteApprentissageColoree: number;
  // Précisions
  raison: RaisonCorrectionType;
  motif: string;
  autreMotif?: string;
  commentaire?: string;
};

