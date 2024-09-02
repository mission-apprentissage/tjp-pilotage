export interface FranceTravailStatsPerspectiveRecrutementValeurParPeriode {
  datMaj: string;
  codeTypeTerritoire: string;
  codeTerritoire: string;
  libTerritoire: string;
  codeTypeActivite: string;
  codeActivite: string;
  libActivite: string;
  codeNomenclature: string;
  libNomenclature: string;
  codeTypePeriode: string;
  codePeriode: string;
  libPeriode: string;
  valeurPrincipaleNom: string;
}

export interface FranceTravailStatsPerspectiveRecrutementResponse {
  datMaj: string;
  codeIndicateur: string;
  codeFamille: string;
  libIndicateur: string;
  listeValeursParPeriode?: FranceTravailStatsPerspectiveRecrutementValeurParPeriode[];
}
