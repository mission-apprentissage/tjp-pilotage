import type {TypeDemandeType} from '../enum/demandeTypeEnum';
import { DemandeTypeEnum} from '../enum/demandeTypeEnum';


export const isTypeFermeture = (typeDemande?: TypeDemandeType) => typeDemande === DemandeTypeEnum["fermeture"];

export const isTypeOuverture = (typeDemande?: TypeDemandeType) =>
  typeDemande === DemandeTypeEnum["ouverture_nette"] || typeDemande === DemandeTypeEnum["ouverture_compensation"];

export const isTypeAugmentation = (typeDemande?: TypeDemandeType) =>
  typeDemande === DemandeTypeEnum["augmentation_nette"] || typeDemande === DemandeTypeEnum["augmentation_compensation"];

export const isTypeDiminution = (typeDemande?: TypeDemandeType) => typeDemande === DemandeTypeEnum["diminution"];

export const isTypeCompensation = (typeDemande?: TypeDemandeType) =>
  typeDemande === DemandeTypeEnum["augmentation_compensation"] || typeDemande === DemandeTypeEnum["ouverture_compensation"];

export const isTypeTransfert = (typeDemande?: TypeDemandeType) => typeDemande === DemandeTypeEnum["transfert"];

export const isTypeColoration = (typeDemande?: TypeDemandeType) => typeDemande === DemandeTypeEnum["coloration"];

export const isTypeAjustement = (typeDemande?: TypeDemandeType) => typeDemande === DemandeTypeEnum["ajustement"];
