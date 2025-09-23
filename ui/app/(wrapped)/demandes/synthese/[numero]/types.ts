import type {AvisStatutType} from 'shared/enum/avisStatutEnum';
import type {DemandeStatutType} from 'shared/enum/demandeStatutEnum';
import type {TypeAvisType} from 'shared/enum/typeAvisEnum';


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
  typeAvis: TypeAvisType;
  commentaire?: string;
  isVisibleParTous: boolean;
  userFonction?: string;
};
