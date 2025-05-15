import { Box, Flex } from "@chakra-ui/react";
import { createRef, useEffect, useState } from "react";
import type { MapRef } from "react-map-gl/maplibre";
import type { Etablissement } from "shared/routes/schemas/get.formation.cfd.map.schema";

import { client } from "@/api.client";
import { FormationHeader } from "@/app/(wrapped)/panorama/domaine-de-formation/[codeNsf]/components/FormationSection/FormationHeader";
import { useFormationContext } from "@/app/(wrapped)/panorama/domaine-de-formation/[codeNsf]/context/formationContext";
import { useNsfContext } from "@/app/(wrapped)/panorama/domaine-de-formation/[codeNsf]/context/nsfContext";

import { FormationAbsente } from "./components/FormationAbsente";
import { ExportListEtablissements } from "./ExportListEtablissements";
import { List } from "./List";
import { MapEtablissements } from "./Map";
import { MapActions } from "./MapActions";

const COORDOONNEES_FRANCE = {
  latMin: 41.19,
  latMax: 51.0521,
  lngMin: 5.0904,
  lngMax: 9.15,
};

const useEtablissementsTab = () => {
  const { currentFilters, handleClearBbox, handleSetBbox } = useFormationContext();
  const { selection: { cfd }, codeRegion, codeAcademie, codeDepartement } = currentFilters;
  const mapContainer = createRef<HTMLDivElement>();
  const [activeUai, setActiveUai] = useState<string | null>(null);
  const [hoverUai, setHoverUai] = useState<string | null>(null);
  const [map, setMap] = useState<MapRef>();

  const [mapDimensions, setMapDimensions] = useState<{
    height: number;
    width: number;
  }>({
    height: 0,
    width: 0,
  });
  const [defaultBbox, setDefaultBbox] = useState(COORDOONNEES_FRANCE);
  const [displayedEtablissements, setDisplayedEtablissements] = useState<Etablissement[]>([]);

  const { data: dataFormation, isLoading: isLoadingFormation } = client.ref("[GET]/formation/:cfd").useQuery(
    {
      params: { cfd },
      query: { codeRegion, codeAcademie, codeDepartement },
    },
    {
      keepPreviousData: true,
      staleTime: 10000000,
      enabled: !!cfd,
    }
  );

  const { data: dataEtablissementsMap, isLoading: isLoadingEtablissements } = client
    .ref("[GET]/formation/:cfd/map")
    .useQuery(
      {
        params: { cfd },
        query: {
          codeRegion,
          codeAcademie,
          codeDepartement,
          orderBy: currentFilters.etab.orderBy,
          includeAll: currentFilters.etab.includeAll,
        },
      },
      {
        keepPreviousData: true,
        staleTime: 10000000,
        enabled: !!cfd && !!mapDimensions.height && !!mapDimensions.width,
      }
    );

  useEffect(() => {
    if (mapContainer.current) {
      if (
        mapContainer.current.clientHeight !== mapDimensions.height ||
        mapContainer.current.clientWidth !== mapDimensions.width
      ) {
        setMapDimensions({
          height: mapContainer.current.clientHeight,
          width: mapContainer.current.clientWidth,
        });
      }
    }
  }, [mapContainer, mapDimensions.height, mapDimensions.width]);

  useEffect(() => {
    if (dataEtablissementsMap?.bbox) {
      setDefaultBbox(dataEtablissementsMap.bbox);
      if (currentFilters.etab.bbox === undefined) {
        map?.fitBounds(
          [
            [dataEtablissementsMap.bbox.lngMin, dataEtablissementsMap.bbox.latMin],
            [dataEtablissementsMap.bbox.lngMax, dataEtablissementsMap.bbox.latMax],
          ],
          {
            padding: 20,
          },
          {
            computer: true,
          }
        );
      }
    }
  }, [dataEtablissementsMap, map, currentFilters.etab.bbox]);

  useEffect(() => {
    if (dataEtablissementsMap?.etablissements) {
      setDisplayedEtablissements(
        dataEtablissementsMap.etablissements.filter((etablissement) => {
          const isInBbox =
            etablissement.latitude >= (currentFilters.etab.bbox ?? defaultBbox).latMin &&
            etablissement.latitude <= (currentFilters.etab.bbox ?? defaultBbox).latMax &&
            etablissement.longitude >= (currentFilters.etab.bbox ?? defaultBbox).lngMin &&
            etablissement.longitude <= (currentFilters.etab.bbox ?? defaultBbox).lngMax;

          return isInBbox;
        })
      );
    }
  }, [dataEtablissementsMap?.etablissements, currentFilters.etab.bbox, defaultBbox]);

  const handleRecenter = () => {
    map?.fitBounds([
      [defaultBbox.lngMin, defaultBbox.latMin],
      [defaultBbox.lngMax, defaultBbox.latMax],
    ]);
    handleClearBbox();
  };

  return {
    dataFormation,
    currentFilters,
    mapContainer,
    mapDimensions,
    etablissements: displayedEtablissements,
    isLoading: isLoadingEtablissements && isLoadingFormation,
    bbox: currentFilters.etab.bbox ?? defaultBbox,
    setBbox: handleSetBbox,
    map,
    setMap: (map: MapRef) => setMap(map),
    activeUai,
    setActiveUai: (uai: string | null) => setActiveUai(uai),
    hoverUai,
    setHoverUai: (uai: string | null) => setHoverUai(uai),
    handleRecenter,
  };
};

export const EtablissementsTab = () => {
  const { codeNsf, libelleNsf } = useNsfContext();
  const { currentFilters } = useFormationContext();
  const {
    selection: { cfd },
    etab: { view },
  } = currentFilters;

  const {
    dataFormation,
    mapContainer,
    etablissements,
    isLoading,
    setMap,
    setBbox,
    activeUai,
    setActiveUai,
    hoverUai,
    setHoverUai,
    bbox,
    handleRecenter,
  } = useEtablissementsTab();

  if (isLoading || !cfd || !dataFormation) {
    return null;
  }

  return (
    <Flex direction={"column"} gap={8}>
      <FormationHeader
        data={dataFormation}
        exportButton={
          <ExportListEtablissements
            etablissements={etablissements}
            formation={dataFormation}
            domaineDeFormation={{ codeNsf, libelleNsf }}
          />
        }
      />
      <MapActions nbEtablissementsInZone={etablissements.length} handleRecenter={handleRecenter} />
      <FormationAbsente nbEtablissements={etablissements?.length} />
      {view === "map" && (
        <Box ref={mapContainer} aspectRatio={4 / 3}>
          <MapEtablissements
            isLoading={isLoading}
            etablissements={etablissements}
            setMap={setMap}
            setBbox={setBbox}
            activeUai={activeUai}
            setActiveUai={setActiveUai}
            hoverUai={hoverUai}
            setHoverUai={setHoverUai}
            bbox={bbox}
          />
        </Box>
      )}
      {view === "list" && <List isLoading={isLoading} etablissements={etablissements} />}
    </Flex>
  );
};
