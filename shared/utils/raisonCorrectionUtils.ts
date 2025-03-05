import type {RaisonCorrectionType} from '../enum/raisonCorrectionEnum';
import { RaisonCorrectionEnum} from '../enum/raisonCorrectionEnum';


export const isRaisonAnnulation = (raison: RaisonCorrectionType): boolean => raison === RaisonCorrectionEnum["annulation"];

export const isRaisonReport = (raison: RaisonCorrectionType): boolean => raison === RaisonCorrectionEnum["report"];

export const isRaisonModificationCapacite = (raison: RaisonCorrectionType): boolean =>
  raison === RaisonCorrectionEnum["modification_capacite"];
