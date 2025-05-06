import {TypeFamilleEnum} from 'shared/enum/typeFamilleEnum';

import { formatNumber } from "@/utils/formatUtils";

export const formatTaux = (value?: number): number => formatNumber((value ?? 0) * 100);

export const formatAbsolute = (value?: number): number => formatNumber(value, 2);

export const formatAbsoluteOrUndefined = (value?: number): number | undefined =>
  value === undefined ? undefined : Number((value ?? 0).toFixed(2));

export const formatMillesime = (millesime: string): string =>
  `${millesime.split("_")[0]}+${millesime.split("_")[1].substring(2)}`;

export const formatFamilleMetierLibelle = (libelleFormation: string): string => {
  return libelleFormation.replace("2nde commune", "").replace("1ere commune", "");
};

export const formatTypeFamilleLong = (typeFamille: string): string => {
  return typeFamille
    .replace(TypeFamilleEnum["2nde_commune"], "Seconde commune")
    .replace(TypeFamilleEnum["1ere_commune"], "Première année commune")
    .replace(TypeFamilleEnum["specialite"], "Spécialité")
    .replace(TypeFamilleEnum["option"], "Option")
    .replace("fermeture", "Fermeture au ");
};

export const formatTypeFamilleCourt = (typeFamille: string): string => {
  return typeFamille
    .replace(TypeFamilleEnum["2nde_commune"], "2de")
    .replace(TypeFamilleEnum["1ere_commune"], "1ère")
    .replace(TypeFamilleEnum["specialite"], "Spé")
    .replace(TypeFamilleEnum["option"], "Opt")
    .replace("fermeture", "Fermeture au ");
};
