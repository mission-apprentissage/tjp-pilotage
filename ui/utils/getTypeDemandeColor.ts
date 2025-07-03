import type {TypeDemandeType} from 'shared/enum/demandeTypeEnum';
import { DemandeTypeEnum} from 'shared/enum/demandeTypeEnum';


const TYPE_DEMANDE_BG_COLORS: Record<TypeDemandeType, string> = {
  [DemandeTypeEnum["transfert"]]: "purpleGlycine.950",
  [DemandeTypeEnum["coloration"]]: "bluefrance.850_hover",
  [DemandeTypeEnum["ajustement"]]: "bluefrance.850_hover",
  [DemandeTypeEnum["augmentation_nette"]]: "bluefrance.525",
  [DemandeTypeEnum["augmentation_compensation"]]: "bluefrance.525",
  [DemandeTypeEnum["ouverture_nette"]]: "bluefrance.525",
  [DemandeTypeEnum["ouverture_compensation"]]: "bluefrance.525",
  [DemandeTypeEnum["fermeture"]]: "blueEcumeMoon.675",
  [DemandeTypeEnum["diminution"]]: "blueEcumeMoon.675",
};

const TYPE_DEMANDE_COLORS: Record<TypeDemandeType, string> = {
  [DemandeTypeEnum["transfert"]]: "purpleGlycine.319",
  [DemandeTypeEnum["coloration"]]: "white",
  [DemandeTypeEnum["ajustement"]]: "white",
  [DemandeTypeEnum["augmentation_nette"]]: "white",
  [DemandeTypeEnum["augmentation_compensation"]]: "white",
  [DemandeTypeEnum["ouverture_nette"]]: "white",
  [DemandeTypeEnum["ouverture_compensation"]]: "white",
  [DemandeTypeEnum["fermeture"]]: "white",
  [DemandeTypeEnum["diminution"]]: "white",
};

export const getTypeDemandeTextColor = (typeDemande: TypeDemandeType): string =>
  TYPE_DEMANDE_COLORS[typeDemande] || "white";

export const getTypeDemandeBgColor = (typeDemande: TypeDemandeType): string =>
  TYPE_DEMANDE_BG_COLORS[typeDemande] || "grey.1000_active";
