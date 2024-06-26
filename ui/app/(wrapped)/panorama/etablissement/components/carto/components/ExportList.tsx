import { useSearchParams } from "next/navigation";
import { usePlausible } from "next-plausible";

import { client } from "@/api.client";
import { useEtablissementMapContext } from "@/app/(wrapped)/panorama/etablissement/components/carto/context/etablissementMapContext";
import { useEtablissementContext } from "@/app/(wrapped)/panorama/etablissement/context/etablissementContext";
import { ExportMenuButton } from "@/components/ExportMenuButton";
import { downloadCsv, downloadExcel } from "@/utils/downloadExport";

import { formatCommuneLibelleWithCodeDepartement } from "../../../../../utils/formatLibelle";

const EXPORT_LIMIT = 1_000_000;

export const ExportList = () => {
  const trackEvent = usePlausible();

  const { uai } = useEtablissementContext();
  const { bbox, cfdFilter } = useEtablissementMapContext();
  const offre = useSearchParams().get("offre");
  const { analyseDetaillee } = useEtablissementContext();
  const analyseDetailleeOffre =
    analyseDetaillee && offre ? analyseDetaillee?.formations[offre] : undefined;

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

  console.log(analyseDetailleeOffre);

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
            libelleFormation: `${analyseDetailleeOffre?.libelleFormation} (${analyseDetailleeOffre?.libelleDispositif})`,
            voie: analyseDetailleeOffre?.voie,
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
            libelleFormation: `${analyseDetailleeOffre?.libelleFormation} (${analyseDetailleeOffre?.libelleDispositif})`,
            voie: analyseDetailleeOffre?.voie,
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
