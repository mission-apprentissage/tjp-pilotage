export type BesoinRHLabel = keyof typeof BESOINS_RH_LABELS;

export const getBesoinRHLabel = (motif: BesoinRHLabel): string =>
  BESOINS_RH_LABELS[motif];

export const BESOINS_RH_LABELS = {
  besoin_reconversion: "Besoin de reconversion d'un ou plusieurs enseignants",
  besoin_recrutement:
    "Besoin de recrutement d'un ou plusieurs enseignants dans la discipline",
  besoin_professeur_associe: "Besoin d'un professeur associé",
  besoin_formation:
    "Besoin d'une formation spécifique des équipes pédagogiques",
  autre: "Précisions complémentaires ou autre besoin",
};
