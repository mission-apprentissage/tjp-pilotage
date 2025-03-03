import type { DemandeStatutType } from "shared/enum/demandeStatutEnum";
import type { DemandeTypeType } from "shared/enum/demandeTypeEnum";

export type PartialIntentionForms = Partial<IntentionForms>;

export type IntentionForms = {
  // Formation et établissement
  uai: string;
  cfd: string;
  codeDispositif: string;
  libelleFCIL?: string;
  // Type de demande
  rentreeScolaire: number;
  typeDemande: DemandeTypeType;
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
  coloration: boolean;
  libelleColoration?: string;
  amiCma: boolean;
  amiCmaValide?: boolean;
  amiCmaEnCoursValidation?: boolean;
  amiCmaValideAnnee?: string;
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
  // Observations / commentaires
  commentaire?: string;
  // Statut
  statut: Exclude<DemandeStatutType, "supprimée">;
  motifRefus?: string[];
  autreMotifRefus?: string;
  // Hidden
  campagneId: string;
};
