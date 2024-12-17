import { usePlausible } from "next-plausible";

import type { Etablissement, Formation } from "@/app/(wrapped)/domaine-de-formation/[codeNsf]/types";
import { ExportMenuButton } from "@/components/ExportMenuButton";
import type { ExportColumns } from "@/utils/downloadExport";
import { downloadCsv, downloadExcel } from "@/utils/downloadExport";
import { formatExportFilename } from "@/utils/formatExportFilename";
import { formatCommuneLibelleWithCodeDepartement, formatLibelleFormation, formatSecteur } from "@/utils/formatLibelle";
import { formatArray } from "@/utils/formatUtils";

const extractDatas = (
  etablissement: Etablissement,
  formation: Formation,
  domaineDeFormation: { codeNsf: string; libelleNsf: string }
) => {
  const { libelleEtablissement, commune, codeDepartement, ...restEtablissement } = etablissement;
  const { libelle: libelleFormation, ...restFormation } = formation;

  return {
    codeNsf: domaineDeFormation.codeNsf,
    libelleNsf: domaineDeFormation.libelleNsf,
    libelleFormation: formatLibelleFormation({
      libellesDispositifs: etablissement.libellesDispositifs,
      libelleFormation: formation.libelle,
    }),
    ...restFormation,
    libelleEtablissement,
    commune: formatCommuneLibelleWithCodeDepartement({
      commune: etablissement.commune,
      codeDepartement: etablissement.codeDepartement,
    }),
    ...restEtablissement,
    secteur: formatSecteur(etablissement.secteur),
    voie: formatArray([
      etablissement.isApprentissage ? "Apprentissage" : "",
      etablissement.isScolaire ? "Scolaire" : "",
    ]),
  };
};

const columns: ExportColumns<ReturnType<typeof extractDatas>> = {
  codeNsf: "Code NSF",
  libelleNsf: "Domaine de formation",
  libelleFormation: "Formation",
  cfd: "CFD",
  isBTS: "BTS",
  isApprentissage: "Apprentissage",
  isScolaire: "Scolaire",
  isTransitionDemographique: "Transition démographique",
  isTransitionEcologique: "Transition écologique",
  isTransitionNumerique: "Transition numérique",
  uai: "UAI",
  commune: "Commune",
  latitude: "Latitude",
  longitude: "Longitude",
  libelleEtablissement: "Libellé établissement",
  tauxInsertion: "Taux d'emploi à 6 mois",
  tauxDevenirFavorable: "Taux de devenir",
  tauxPoursuite: "Taux de poursuite d'études",
  tauxPression: "Taux de pression",
  effectifs: "Effectifs",
  secteur: "Secteur",
};

export const ExportListEtablissements = ({
  etablissements,
  formation,
  domaineDeFormation,
}: {
  etablissements: Etablissement[];
  formation: Formation;
  domaineDeFormation: { codeNsf: string; libelleNsf: string };
}) => {
  const trackEvent = usePlausible();

  const onExportCsv = async () => {
    if (!etablissements.length) return;

    trackEvent("domaine-de-formation-etablissements:export-csv");

    downloadCsv(
      formatExportFilename("domaine-de-formation_etablissements"),
      etablissements.map((etablissement) => extractDatas(etablissement, formation, domaineDeFormation)),
      columns
    );
  };

  const onExportExcel = async () => {
    if (!etablissements.length) return;

    trackEvent("domaine-de-formation-etablissements:export-excel");

    downloadExcel(
      formatExportFilename("domaine-de-formation_etablissements"),
      etablissements.map((etablissement) => extractDatas(etablissement, formation, domaineDeFormation)),
      columns
    );
  };

  return <ExportMenuButton onExportCsv={onExportCsv} onExportExcel={onExportExcel} variant="ghost" />;
};
