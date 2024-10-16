import { Box, Flex } from "@chakra-ui/react";
import { createRef, useEffect, useState } from "react";
import type { MapRef } from "react-map-gl/maplibre";

import { client } from "@/api.client";
import { FormationHeader } from "@/app/(wrapped)/domaine-de-formation/[codeNsf]/components/FormationSection/FormationHeader";
import type { Filters } from "@/app/(wrapped)/domaine-de-formation/[codeNsf]/types";
import { useStateParams } from "@/utils/useFilters";

import { List } from "./List";
import { Map } from "./Map";
import { MapActions } from "./MapActions";

export type EtablissementsView = "map" | "list";
export type EtablissementsOrderBy = "departement_commune" | "libelle";

export type EtablissementsFilters = {
  includeAll: boolean;
  view: EtablissementsView;
  orderBy: EtablissementsOrderBy;
};

const useEtablissementsTab = ({
  cfd,
  codeRegion,
  codeAcademie,
  codeDepartement,
}: {
  cfd: string;
  codeRegion?: string;
  codeAcademie?: string;
  codeDepartement?: string;
}) => {
  const [activeUai, setActiveUai] = useState<string | null>(null);
  const [hoverUai, setHoverUai] = useState<string | null>(null);
  const [map, setMap] = useState<MapRef>();
  const [etabFilters, setEtabFilters] = useStateParams<EtablissementsFilters>({
    defaultValues: {
      includeAll: true,
      view: "map",
      orderBy: "departement_commune",
    },
    prefix: "etab",
  });
  const mapContainer = createRef<HTMLDivElement>();
  const [mapDimensions, setMapDimensions] = useState<{
    height: number;
    width: number;
  }>({
    height: 0,
    width: 0,
  });
  const [bbox, setBbox] = useState({
    latMin: 0,
    lngMin: 0,
    latMax: 0,
    lngMax: 0,
  });

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
          mapHeight: mapDimensions.height,
          mapWidth: mapDimensions.width,
          orderBy: etabFilters.orderBy,
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
      setBbox(dataEtablissementsMap.bbox);
    }
  }, [dataEtablissementsMap]);

  const handleIncludeAllChange = (includeAll: boolean) => {
    setEtabFilters({ ...etabFilters, includeAll });
  };

  const handleViewChange = (view: EtablissementsView) => {
    setEtabFilters({ ...etabFilters, view });
  };

  const handleOrderByChange = (orderBy: EtablissementsOrderBy) => {
    setEtabFilters({ ...etabFilters, orderBy });
  };

  return {
    dataFormation,
    etabFilters,
    handleIncludeAllChange,
    handleViewChange,
    handleOrderByChange,
    mapContainer,
    mapDimensions,
    etablissements: dataEtablissementsMap?.etablissements ?? [],
    isLoading: isLoadingEtablissements && isLoadingFormation,
    bbox,
    setBbox,
    map,
    setMap: (map: MapRef) => setMap(map),
    activeUai,
    setActiveUai: (uai: string | null) => setActiveUai(uai),
    hoverUai,
    setHoverUai: (uai: string | null) => setHoverUai(uai),
  };
};

export const EtablissementsTab = ({ filters }: { filters: Filters }) => {
  const { cfd, codeRegion, codeAcademie, codeDepartement } = filters;

  const {
    dataFormation,
    etabFilters,
    handleIncludeAllChange,
    handleViewChange,
    handleOrderByChange,
    mapContainer,
    etablissements,
    isLoading,
    setMap,
    setBbox,
    activeUai,
    setActiveUai,
    hoverUai,
    setHoverUai,
  } = useEtablissementsTab({
    cfd,
    codeRegion,
    codeAcademie,
    codeDepartement,
  });

  if (isLoading || !cfd || !dataFormation) {
    return null;
  }

  return (
    <Flex direction={"column"} gap={8} w={"60%"}>
      <FormationHeader data={dataFormation} />
      <MapActions
        nbEtablissementsInZone={etablissements.length}
        etabFilters={etabFilters}
        handleIncludeAllChange={handleIncludeAllChange}
        handleViewChange={handleViewChange}
        handleOrderByChange={handleOrderByChange}
      />
      {etabFilters.view === "map" && (
        <Box ref={mapContainer} aspectRatio={1}>
          <Map
            isLoading={isLoading}
            etablissements={etablissements}
            setMap={setMap}
            setBbox={setBbox}
            activeUai={activeUai}
            setActiveUai={setActiveUai}
            hoverUai={hoverUai}
            setHoverUai={setHoverUai}
          />
        </Box>
      )}
      {etabFilters.view === "list" && <List isLoading={isLoading} etablissements={etablissements} />}
    </Flex>
  );
};
