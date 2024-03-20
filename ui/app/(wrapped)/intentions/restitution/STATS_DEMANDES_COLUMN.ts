import { client } from "@/api.client";

import { ExportColumns } from "../../../../utils/downloadExport";

export const STATS_DEMANDES_COLUMNS = {
  numero: "N° demande",
  cfd: "CFD",
  libelleFormation: "Formation",
  codeDispositif: "Code Dispositif",
  libelleDispositif: "Dispositif",
  niveauDiplome: "Diplôme",
  uai: "UAI",
  libelleEtablissement: "Établissement",
  commune: "Commune",
  rentreeScolaire: "RS",
  typeDemande: "Type de demande",
  motif: "Motif(s) de la demande",
  autreMotif: "Autre motif",
  libelleColoration: "Libellé coloration",
  libelleFCIL: "Libellé FCIL",
  amiCma: "AMI/CMA ?",
  poursuitePedagogique: "Poursuite pédagogique ?",
  commentaire: "Commentaire",
  libelleNsf: "Domaine de formation (NSF)",
  statut: "Statut",
  codeRegion: "CodeRegion",
  libelleRegion: "Région",
  codeAcademie: "CodeAcadémie",
  codeDepartement: "CodeDepartement",
  libelleDepartement: "Département",
  dateCreation: "Date de création",
  dateModification: "Date de dernière modification",
  compensationCfd: "CFD compensé",
  compensationCodeDispositif: "Dispositif compensé",
  compensationUai: "UAI compensé",
  differenceCapaciteScolaire: "Nombre de places en voie scolaire",
  capaciteScolaireActuelle: "Capacité scolaire actuelle",
  capaciteScolaire: "Capacité scolaire",
  capaciteScolaireColoree: "Capacité scolaire coloree",
  differenceCapaciteApprentissage: "Nombre de places en apprentissage",
  capaciteApprentissageActuelle: "Capacité apprentissage actuelle",
  capaciteApprentissage: "Capacité apprentissage",
  capaciteApprentissageColoree: "Capacité apprentissage coloree",
  tauxInsertion: "Tx d'emploi à 6 mois régional",
  tauxPoursuite: "Tx de poursuite d'études régional",
  devenirFavorable: "Tx de devenir favorable régional",
  positionQuadrant: "Position dans le quadrant",
  pression: "Tx de pression régional",
  nbEtablissement: "Nb établissement",
  motifRefus: "Motif(s) de refus",
  autreMotifRefus: "Autre motif de refus",
} satisfies ExportColumns<
  (typeof client.infer)["[GET]/intentions/stats"]["demandes"][number]
>;
