import type { DemandeStatutType } from '../enum/demandeStatutEnum';
import { DemandeStatutEnum  } from '../enum/demandeStatutEnum';

export const isStatutBrouillon = (statut?: DemandeStatutType) => statut === DemandeStatutEnum["brouillon"];

export const isStatutProposition = (statut?: DemandeStatutType) => statut === DemandeStatutEnum["proposition"];

export const isStatutDossierIncomplet = (statut?: DemandeStatutType) => statut === DemandeStatutEnum["dossier incomplet"];

export const isStatutDossierComplet = (statut?: DemandeStatutType) => statut === DemandeStatutEnum["dossier complet"];

export const isStatutPretPourLeVote = (statut?: DemandeStatutType) => statut === DemandeStatutEnum["prêt pour le vote"];

export const isStatutProjetDeDemande = (statut?: DemandeStatutType) => statut === DemandeStatutEnum["projet de demande"];

export const isStatutDemandeValidee = (statut?: DemandeStatutType) => statut === DemandeStatutEnum["demande validée"];

export const isStatutRefusee = (statut?: DemandeStatutType) => statut === DemandeStatutEnum["refusée"];

export const isStatutSupprimee = (statut?: DemandeStatutType) => statut === DemandeStatutEnum["supprimée"];



