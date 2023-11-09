import { ApiType } from "shared";

import { api } from "../../../../api.client";
import { ExportColumns } from "../../../../utils/downloadCsv";

export const STATS_DEMANDES_COLUMNS = {
  id: "N° demande",
  cfd: "CFD",
  libelleDiplome: "Formation",
  dispositifId: "DispositifId",
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
  libelleFiliere: "Filière",
  status: "Status",
  codeRegion: "CodeRegion",
  libelleRegion: "Région",
  codeAcademie: "CodeAcadémie",
  codeDepartement: "CodeDepartement",
  libelleDepartement: "Département",
  createdAt: "Date de création",
  compensationCfd: "CFD compensé",
  compensationDispositifId: "Dispositif compensé",
  compensationUai: "UAI compensé",
  differenceCapaciteScolaire: "Nombre de places en voie scolaire",
  capaciteScolaireActuelle: "Capacité scolaire actuelle",
  capaciteScolaire: "Capacité scolaire",
  capaciteScolaireColoree: "Capacité scolaire coloree",
  differenceCapaciteApprentissage: "Nombre de places en apprentissage",
  capaciteApprentissageActuelle: "Capacité apprentissage actuelle",
  capaciteApprentissage: "Capacité apprentissage",
  capaciteApprentissageColoree: "Capacité apprentissage coloree",
  insertion: "Tx d'emploi à 6 mois régional",
  poursuite: "Tx de poursuite d'études régional",
  devenirFavorable: "Tx de devenir favorable régional",
  positionQuadrant: "Position dans le quadrant",
  pression: "Tx de pression régional",
  nbEtablissement: "Nb établissement",
} satisfies ExportColumns<
  ApiType<typeof api.getRestitutionIntentionsStats>["demandes"][number]
>;
