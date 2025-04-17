import type {AvisStatutType} from 'shared/enum/avisStatutEnum';
import type {AvisTypeType} from 'shared/enum/avisTypeEnum';
import type {DemandeStatutType} from 'shared/enum/demandeStatutEnum';


export type ChangementStatutFormType = {
  id: string;
  createdBy: string;
  demandeNumero: string;
  statutPrecedent?: Exclude<DemandeStatutType, "supprimée">;
  statut: Exclude<DemandeStatutType, "supprimée">;
  commentaire?: string;
};

export type AvisFormType = {
  id: string;
  createdBy: string;
  updatedBy?: string;
  demandeNumero: string;
  statutAvis: AvisStatutType;
  typeAvis: AvisTypeType;
  commentaire?: string;
  isVisibleParTous: boolean;
  userFonction?: string;
};
