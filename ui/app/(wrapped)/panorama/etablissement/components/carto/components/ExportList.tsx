import { usePlausible } from "next-plausible";

import { client } from "@/api.client";
import { ExportMenuButton } from "@/components/ExportMenuButton";
import { downloadCsv, downloadExcel } from "@/utils/downloadExport";
import { formatExportFilename } from "@/utils/formatExportFilename";
import { formatCommuneLibelleWithCodeDepartement } from "@/utils/formatLibelle";
import { formatArray } from "@/utils/formatUtils";

import { useEtablissementContext } from "../../../context/etablissementContext";
import { useEtablissementMapContext } from "../context/etablissementMapContext";

const formatLibelleFormation = (etablissement: {
  libellesDispositifs: string[];
  libelleFormation: string;
}) => {
  const dispositifs =
    formatArray(etablissement.libellesDispositifs) !== ""
      ? `(${formatArray(etablissement.libellesDispositifs)})`
      : "";
  return `${etablissement.libelleFormation} ${dispositifs}`;
};

export const ExportList = () => {
  const trackEvent = usePlausible();

  const { uai } = useEtablissementContext();
  const { bbox, cfdFilter } = useEtablissementMapContext();

  const { data: etablissementsList, isLoading } = client
    .ref("[GET]/etablissement/:uai/map/list")
    .useQuery({
      params: {
        uai,
      },
      query: {
        bbox: {
          minLat: "" + bbox.minLat,
          maxLat: "" + bbox.maxLat,
          minLng: "" + bbox.minLng,
          maxLng: "" + bbox.maxLng,
        },
        cfd: cfdFilter ? [cfdFilter] : undefined,
      },
    });

  const etablissementsProches = etablissementsList?.etablissementsProches;

  const onExportCsv = async () => {
    if (!etablissementsProches) return;
    trackEvent("panorama-etablissement-liste-carte:export");
    downloadCsv(
      formatExportFilename("etablissements_proches"),
      etablissementsProches.map((etablissement) => ({
        ...etablissement,
        commune: formatCommuneLibelleWithCodeDepartement({
          commune: etablissement.commune,
          codeDepartement: etablissement.codeDepartement,
        }),
        libelleFormation: formatLibelleFormation(etablissement),
        voie: formatArray(etablissement.voies),
      })),
      {
        libelleFormation: "Formation",
        voie: "Voie",
        uai: "UAI",
        libelleEtablissement: "Libellé établissement",
        commune: "Commune",
        distance: "Distance (en km)",
        effectif: "Effectif",
        tauxInsertion: "Taux d'insertion à 6 mois",
        tauxPoursuite: "Taux de poursuite d'études",
        libelleAcademie: "Académie",
        libelleRegion: "Région",
      }
    );
  };

  const onExportExcel = async () => {
    if (!etablissementsProches) return;
    trackEvent("panorama-etablissement-liste-carte:export-excel");
    downloadExcel(
      formatExportFilename("etablissements_proches"),
      etablissementsProches.map((etablissement) => ({
        ...etablissement,
        commune: formatCommuneLibelleWithCodeDepartement({
          commune: etablissement.commune,
          codeDepartement: etablissement.codeDepartement,
        }),
        libelleFormation: formatLibelleFormation(etablissement),
        voie: formatArray(etablissement.voies),
      })),
      {
        libelleFormation: "Formation",
        voie: "Voie",
        uai: "UAI",
        libelleEtablissement: "Libellé établissement",
        commune: "Commune",
        distance: "Distance (en km)",
        effectif: "Effectif",
        tauxInsertion: "Taux d'insertion à 6 mois",
        tauxPoursuite: "Taux de poursuite d'études",
        libelleAcademie: "Académie",
        libelleRegion: "Région",
      }
    );
  };

  return (
    <ExportMenuButton
      onExportCsv={onExportCsv}
      onExportExcel={onExportExcel}
      variant="solid"
      isQueryLoading={isLoading}
    />
  );
};
