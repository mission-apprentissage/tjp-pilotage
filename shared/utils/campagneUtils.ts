import { CampagneStatutEnum } from '../enum/campagneStatutEnum';
import type { CampagneType } from '../schema/campagneSchema';

export const isCampagneTerminee = (campagne?: CampagneType) => campagne?.statut === CampagneStatutEnum["terminée"];

export const isCampagneEnCours = (campagne?: CampagneType) => campagne?.statut === CampagneStatutEnum["en cours"];

export const isCampagneEnAttente = (campagne?: CampagneType) => campagne?.statut === CampagneStatutEnum["en attente"];



