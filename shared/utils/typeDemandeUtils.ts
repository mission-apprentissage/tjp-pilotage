import type {DemandeTypeType} from '../enum/demandeTypeEnum';
import { DemandeTypeEnum} from '../enum/demandeTypeEnum';


export const isTypeFermeture = (typeDemande: DemandeTypeType) => typeDemande === DemandeTypeEnum["fermeture"];

export const isTypeOuverture = (typeDemande: DemandeTypeType) =>
  typeDemande === DemandeTypeEnum["ouverture_nette"] || typeDemande === DemandeTypeEnum["ouverture_compensation"];

export const isTypeAugmentation = (typeDemande: DemandeTypeType) =>
  typeDemande === DemandeTypeEnum["augmentation_nette"] || typeDemande === DemandeTypeEnum["augmentation_compensation"];

export const isTypeDiminution = (typeDemande: DemandeTypeType) => typeDemande === DemandeTypeEnum["diminution"];

export const isTypeCompensation = (typeDemande: DemandeTypeType) =>
  typeDemande === DemandeTypeEnum["augmentation_compensation"] || typeDemande === DemandeTypeEnum["ouverture_compensation"];

export const isTypeTransfert = (typeDemande: DemandeTypeType) => typeDemande === DemandeTypeEnum["transfert"];

export const isTypeColoration = (typeDemande: DemandeTypeType) => typeDemande === DemandeTypeEnum["coloration"];

export const isTypeAjustement = (typeDemande: DemandeTypeType) => typeDemande === DemandeTypeEnum["ajustement"];
