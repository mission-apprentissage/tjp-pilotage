import type {TypeDemandeType} from 'shared/enum/demandeTypeEnum';
import { DemandeTypeEnum} from 'shared/enum/demandeTypeEnum';


const TYPE_DEMANDE_COLORS: Record<TypeDemandeType, string> = {
  [DemandeTypeEnum["transfert"]]: "bluefrance.850_hover",
  [DemandeTypeEnum["coloration"]]: "bluefrance.850_hover",
  [DemandeTypeEnum["ajustement"]]: "bluefrance.850_hover",
  [DemandeTypeEnum["augmentation_nette"]]: "bluefrance.525",
  [DemandeTypeEnum["augmentation_compensation"]]: "bluefrance.525",
  [DemandeTypeEnum["ouverture_nette"]]: "bluefrance.525",
  [DemandeTypeEnum["ouverture_compensation"]]: "bluefrance.525",
  [DemandeTypeEnum["fermeture"]]: "greenArchipel.200_active",
  [DemandeTypeEnum["diminution"]]: "greenArchipel.200_active",
};

export const getTypeDemandeColor = (typeDemande: TypeDemandeType): string =>
  TYPE_DEMANDE_COLORS[typeDemande] || "grey.1000_active";
