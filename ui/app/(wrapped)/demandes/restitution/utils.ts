import { TypeFormationSpecifiqueEnum } from "shared/enum/formationSpecifiqueEnum";
import { SecteurEnum } from "shared/enum/secteurEnum";
import { getMillesimeFromCampagne } from "shared/time/millesimes";

import { formatLibelleFormationWithoutTags, formatLibellesColoration, formatMillesime } from "@/utils/formatLibelle";

import { STATS_DEMANDES_COLUMNS } from "./STATS_DEMANDES_COLUMN";
import type { DemandesRestitution, FiltersDemandesRestitution } from "./types";

export const findDefaultRentreeScolaireForCampagne = (
  annee: string,
  rentreesScolaires: DemandesRestitution["filters"]["rentreesScolaires"]
) => {
  if (rentreesScolaires) {
    const rentreeScolaire = rentreesScolaires.find((r) => parseInt(r.value) === parseInt(annee) + 1);

    if (rentreeScolaire) return rentreeScolaire.value;
  }

  return undefined;
};


export const getDataForExport = ({
  data,
  filters,
  addPilotageColumns
}: {
    data: DemandesRestitution,
    filters: Partial<FiltersDemandesRestitution>,
    addPilotageColumns: boolean
}) => {
  const region = data.filters.regions.find((r) => r.value === filters.codeRegion?.[0]);

  const academies = data.filters.academies.filter((a) => filters.codeAcademie?.includes(a.value) ?? false);

  const departements = data.filters.departements.filter((d) => filters.codeDepartement?.includes(d.value) ?? false);

  const regionsColumns = {
    selectedCodeRegion: "Code Région sélectionné",
    selectedRegion: "Région sélectionnée",
  };
  const academiesColumns = {
    selectedCodeAcademie: "Code Académie sélectionné",
    selectedAcademie: "Académie sélectionnée",
  };
  const departementsColumns = {
    selectedCodeDepartement: "Code Département sélectionné",
    selectedDepartement: "Departement sélectionnée",
  };

  const { pilotageCapacite,
    pilotageEffectif,
    pilotageTauxRemplissage,
    pilotageTauxPression,
    pilotageTauxDemande,
    ...demandesColumns } = STATS_DEMANDES_COLUMNS;

  let columns : Record<string, string> = {
    ...demandesColumns,
    ...(filters.codeRegion && region ? regionsColumns : {}),
    ...(filters.codeAcademie && academies ? academiesColumns : {}),
    ...(filters.codeDepartement && departements ? departementsColumns : {}),
  };

  if(addPilotageColumns) {
    columns = {
      ...columns,
      pilotageCapacite: pilotageCapacite.replace("{0}", filters.rentreeScolaire ?? ""),
      pilotageEffectif: pilotageEffectif.replace("{0}", filters.rentreeScolaire ?? ""),
      pilotageTauxRemplissage: pilotageTauxRemplissage.replace("{0}", filters.rentreeScolaire ?? ""),
      pilotageTauxPression: pilotageTauxPression.replace("{0}", filters.rentreeScolaire ?? ""),
      pilotageTauxDemande: pilotageTauxDemande.replace("{0}", filters.rentreeScolaire ?? ""),
    };
  }

  let demandes = [];

  demandes = data.demandes.map((demande) => { let updatedDemand = {
    ...demande,
    createdAt: new Date(demande.createdAt).toLocaleDateString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    updatedAt: new Date(demande.updatedAt).toLocaleDateString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    millesime: formatMillesime(getMillesimeFromCampagne(demande.campagne.annee)),
    disciplinesRecrutementRH:
      demande.discipline1RecrutementRH &&
      `${demande.discipline1RecrutementRH} ${
        demande.discipline2RecrutementRH ? `- ${demande.discipline2RecrutementRH}` : ""
      }`,
    disciplinesReconversionRH:
      demande.discipline1ReconversionRH &&
      `${demande.discipline1ReconversionRH} ${
        demande.discipline2ReconversionRH ? `- ${demande.discipline2ReconversionRH}` : ""
      }`,
    disciplinesFormationRH:
      demande.discipline1FormationRH &&
      `${demande.discipline1FormationRH} ${
        demande.discipline2FormationRH ? `- ${demande.discipline2FormationRH}` : ""
      }`,
    disciplinesProfesseurAssocieRH:
      demande.discipline1ProfesseurAssocieRH &&
      `${demande.discipline1ProfesseurAssocieRH} ${
        demande.discipline2ProfesseurAssocieRH ? `- ${demande.discipline2ProfesseurAssocieRH}` : ""
      }`,
    libelleFormation: formatLibelleFormationWithoutTags(demande),
    secteur: demande.secteur === SecteurEnum["PU"] ? "Public" : "Privé",
    actionPrioritaire: demande.formationSpecifique[TypeFormationSpecifiqueEnum["Action prioritaire"]],
    transitionDemographique: demande.formationSpecifique[TypeFormationSpecifiqueEnum["Transition démographique"]],
    transitionEcologique: demande.formationSpecifique[TypeFormationSpecifiqueEnum["Transition écologique"]],
    transitionNumerique: demande.formationSpecifique[TypeFormationSpecifiqueEnum["Transition numérique"]],
    libelleColoration: formatLibellesColoration(demande)
  };

  if(addPilotageColumns) {
    updatedDemand = {
      ...updatedDemand,
      pilotageCapacite: demande.pilotageCapacite,
      pilotageEffectif: demande.pilotageEffectif,
      pilotageTauxRemplissage: demande.pilotageTauxRemplissage,
      pilotageTauxPression: demande.pilotageTauxPression,
      pilotageTauxDemande: demande.pilotageTauxDemande,
    };
  }

  return updatedDemand;
  });

  return {
    columns,
    demandes,
  };
};
