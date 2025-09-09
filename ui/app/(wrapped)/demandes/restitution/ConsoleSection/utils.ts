import type { DEMANDES_COLUMNS_KEYS } from "@/app/(wrapped)/demandes/restitution/types";

import { COLUMNS_WIDTH } from "./COLUMNS_WIDTH";


export const isColonneSticky = ({
  colonne,
  stickyColonnes
} :
{
  colonne: DEMANDES_COLUMNS_KEYS;
  stickyColonnes?: Array<DEMANDES_COLUMNS_KEYS>;
}) => {
  if (!stickyColonnes || stickyColonnes.length === 0) return false;
  return stickyColonnes.includes(colonne);
};

export const isColonneVisible = ({
  colonne,
  colonneFilters
} :
{
  colonne: DEMANDES_COLUMNS_KEYS;
  colonneFilters?: Array<DEMANDES_COLUMNS_KEYS>;
}) => {
  if (!colonneFilters || colonneFilters.length === 0) return false;
  return colonneFilters.includes(colonne);
};

export const getLeftOffset = ({
  colonne,
  stickyColonnes,
  colonneFilters
}: {
  colonne: DEMANDES_COLUMNS_KEYS;
  colonneFilters: Array<DEMANDES_COLUMNS_KEYS>;
  stickyColonnes: Array<DEMANDES_COLUMNS_KEYS>;
}) => {
  let leftValue = 0;
  if (!isColonneSticky({ colonne, stickyColonnes })) return leftValue;
  stickyColonnes
    .filter((stickyColonne) => stickyColonne !== colonne)
    .filter((stickyColonne) => isColonneVisible({ colonne: stickyColonne, colonneFilters }))
    .forEach((stickyColonne) => {
      if (
        Object.keys(COLUMNS_WIDTH).indexOf(colonne) >
        Object.keys(COLUMNS_WIDTH).indexOf(stickyColonne)
      ) leftValue += COLUMNS_WIDTH[stickyColonne as keyof typeof COLUMNS_WIDTH] || 0;
    });
  return leftValue;
};

export const isLastStickyColonne = ({
  colonne,
  stickyColonnes,
}: {
  colonne: DEMANDES_COLUMNS_KEYS;
  stickyColonnes?: Array<DEMANDES_COLUMNS_KEYS>;
}) => stickyColonnes &&
  stickyColonnes.includes(colonne) &&
  stickyColonnes.indexOf(colonne) === stickyColonnes.length - 1;

