import { usePlausible } from "next-plausible";

import { client } from "@/api.client";
import { useEtablissementMapContext } from "@/app/(wrapped)/panorama/etablissement/components/carto/context/etablissementMapContext";
import { useEtablissementContext } from "@/app/(wrapped)/panorama/etablissement/context/etablissementContext";
import { ExportMenuButton } from "@/components/ExportMenuButton";
import { downloadCsv, downloadExcel } from "@/utils/downloadExport";
import { formatArray } from "@/utils/formatUtils";

import { formatCommuneLibelleWithCodeDepartement } from "../../../../../utils/formatLibelle";

const EXPORT_LIMIT = 1_000_000;

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
        limit: EXPORT_LIMIT,
      },
    });

  const etablissementsProches = etablissementsList?.etablissementsProches;
  return (
    <ExportMenuButton
      onExportCsv={async () => {
        if (!etablissementsProches) return;
        trackEvent("panorama-etablissement-liste-carte:export");
        downloadCsv(
          "etablissements_proches",
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
      }}
      onExportExcel={async () => {
        if (!etablissementsProches) return;
        trackEvent("panorama-etablissement-liste-carte:export-excel");
        downloadExcel(
          "etablissements_proches",
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
      }}
      variant="solid"
      isQueryLoading={isLoading}
    />
  );
};
