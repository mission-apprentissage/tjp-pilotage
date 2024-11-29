import type { client } from "@/api.client";
import type { ExportColumns } from "@/utils/downloadExport";

export const CORRECTIONS_COLUMNS = {
  // Établissement
  uai: "UAI",
  libelleEtablissement: "Établissement",
  commune: "Commune",
  codeRegion: "CodeRegion",
  libelleRegion: "Région",
  codeAcademie: "CodeAcadémie",
  libelleAcademie: "Académie",
  codeDepartement: "CodeDepartement",
  libelleDepartement: "Département",
  secteur: "Secteur",
  // Formation
  cfd: "CFD",
  libelleNsf: "Domaine de formation (NSF)",
  libelleFormation: "Formation",
  formationSpecifique: "Formation spécifique",
  codeDispositif: "Code Dispositif",
  libelleDispositif: "Dispositif",
  niveauDiplome: "Diplôme",
  // Demande
  libelleColoration: "Libellé coloration",
  commentaire: "Commentaire",
  intentionNumero: "N° demande",
  createdAt: "Date de création",
  updatedAt: "Date de dernière modification",
  // Correction
  motifCorrection: "Motif(s) de la correction",
  autreMotifCorrection: "Autre motif de correction",
  raisonCorrection: "Type de modification",
  capaciteScolaireCorrigee: "Capacité scolaire corrigée",
  capaciteApprentissageCorrigee: "Capacité apprentissage corrigée",
  ecartScolaire: "Écart capacité scolaire",
  ecartApprentissage: "Écart capacité apprentissage",
  // Devenir favorable de la formation
  tauxInsertionRegional: "Taux d'insertion régional",
  tauxPoursuiteRegional: "Taux de poursuite régional",
  tauxDevenirFavorableRegional: "Taux de devenir favorable régional",
  tauxPressionRegional: "Taux de pression régional",
  positionQuadrant: "Position dans le quadrant",
  nbEtablissement: "Nombre d'établissements",
} satisfies ExportColumns<(typeof client.infer)["[GET]/corrections"]["corrections"][number]> & {
  formationSpecifique: string;
};

export const CORRECTIONS_COLUMNS_OPTIONAL: Partial<typeof CORRECTIONS_COLUMNS> = {
  // Établissement
  libelleEtablissement: "Établissement",
  commune: "Commune",
  libelleRegion: "Région",
  libelleAcademie: "Académie",
  libelleDepartement: "Département",
  secteur: "Secteur Privé ou Public",
  // Formation
  cfd: "CFD",
  libelleNsf: "Domaine de formation (NSF)",
  libelleFormation: "Formation",
  formationSpecifique: "Formation spécifique",
  codeDispositif: "Code Dispositif",
  libelleDispositif: "Dispositif",
  niveauDiplome: "Diplôme",
  // Demande
  libelleColoration: "Libellé coloration",
  commentaire: "Commentaire",
  intentionNumero: "N° demande",
  createdAt: "Date de création",
  updatedAt: "Date de dernière modification",
  // Correction
  motifCorrection: "Motif(s) de la correction",
  autreMotifCorrection: "Autre motif de correction",
  raisonCorrection: "Type de modification",
  capaciteScolaireCorrigee: "Capacité scolaire corrigée",
  capaciteApprentissageCorrigee: "Capacité apprentissage corrigée",
  ecartScolaire: "Écart capacité scolaire",
  ecartApprentissage: "Écart capacité apprentissage",
  // Devenir favorable de la formation
  tauxInsertionRegional: "Taux d'insertion régional",
  tauxPoursuiteRegional: "Taux de poursuite régional",
  tauxDevenirFavorableRegional: "Taux de devenir favorable régional",
  tauxPressionRegional: "Taux de pression régional",
  positionQuadrant: "Position dans le quadrant",
  nbEtablissement: "Nombre d'établissements",
} satisfies Partial<typeof CORRECTIONS_COLUMNS>;

export const CORRECTIONS_COLUMNS_DEFAULT: Partial<typeof CORRECTIONS_COLUMNS_OPTIONAL> = {
  // Établissement
  libelleEtablissement: "Établissement",
  commune: "Commune",
  // Formation
  libelleNsf: "Domaine de formation (NSF)",
  libelleFormation: "Formation",
  niveauDiplome: "Diplôme",
  // Correction
  motifCorrection: "Motif(s) de la correction",
  autreMotifCorrection: "Autre motif de correction",
  raisonCorrection: "Type de modification",
  capaciteScolaireCorrigee: "Capacité scolaire corrigée",
  capaciteApprentissageCorrigee: "Capacité apprentissage corrigée",
  ecartScolaire: "Écart capacité scolaire",
  ecartApprentissage: "Écart capacité apprentissage",
  // Devenir favorable de la formation
  positionQuadrant: "Position dans le quadrant",
} satisfies Partial<typeof CORRECTIONS_COLUMNS_OPTIONAL>;
