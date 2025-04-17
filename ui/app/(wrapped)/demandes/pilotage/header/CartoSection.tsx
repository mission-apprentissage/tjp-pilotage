import { Box, Center, Flex, Heading, Highlight, Select, Skeleton, Text, useToken, VisuallyHidden } from "@chakra-ui/react";
import { useCallback } from "react";
import { ScopeEnum } from "shared";

import type {
  FiltersPilotage,
  FilterTracker,
  Pilotage,
} from "@/app/(wrapped)/demandes/pilotage/types";
import { getScopeCode } from "@/app/(wrapped)/demandes/pilotage/utils";
import { CartoGraph } from "@/components/CartoGraph";
import { ExportMenuButton } from "@/components/ExportMenuButton";
import { downloadCsv, downloadExcel } from "@/utils/downloadExport";
import { formatPercentageWithoutSign } from "@/utils/formatUtils";

export type IndicateurType = "tauxTransformation" | "ratioFermeture";

export const CartoSection = ({
  indicateur,
  handleIndicateurChange,
  indicateurOptions,
  filters,
  handleFilters,
  data,
  isLoading,
  filterTracker,
}: {
  indicateur: IndicateurType;
  handleIndicateurChange: (indicateur: string) => void;
  indicateurOptions: {
    label: string;
    value: string;
    isDefault: boolean;
  }[];
  filters: FiltersPilotage;
  handleFilters: (filters: FiltersPilotage) => void;
  data?: Pilotage;
  isLoading?: boolean;
  filterTracker: FilterTracker;
}) => {
  const customPalette = [
    useToken("colors", "pilotage.red"),
    useToken("colors", "pilotage.orange"),
    useToken("colors", "pilotage.yellow"),
    useToken("colors", "pilotage.green.1"),
    useToken("colors", "pilotage.green.2"),
    useToken("colors", "pilotage.green.3"),
  ];

  const getCustomPalette = () => {
    switch (indicateur) {
    case "tauxTransformation":
      return customPalette;
    case "ratioFermeture":
      return [customPalette[0], customPalette[1], customPalette[2], customPalette[4]];
    }
  };

  const getCustomPieces = () => {
    switch (indicateur) {
    case "tauxTransformation":
      return [
        [0, 1],
        [1, 2],
        [2, 4],
        [4, 5],
        [5, 6],
        [6, 10000],
      ];
    case "ratioFermeture":
      return [
        [0, 15],
        [15, 25],
        [25, 30],
        [30, 100],
      ];
    }
  };

  const getGraphData = useCallback(() => {
    if (!data) {
      return [];
    }

    return Object.values(data?.zonesGeographiques).map((territoire) => ({
      name: territoire.libelle,

      parentName: territoire.libelleAcademie,
      value:
        territoire.effectif || indicateur != "tauxTransformation"
          ? formatPercentageWithoutSign(territoire[indicateur], 1)
          : undefined,

      code: territoire.code,
    }));
    // TODO: REFACTO
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, filters, indicateur]);

  const handleClickOnTerritoire = useCallback(
    (code: string | undefined) => {
      const newFilters = {
        scope: filters.scope,
        codeRegion: filters.scope === ScopeEnum["région"] ? code : undefined,
        codeAcademie: filters.scope === ScopeEnum["académie"] ? code : undefined,
        codeDepartement: filters.scope === ScopeEnum["département"] ? code : undefined,
      };
      switch (filters.scope) {
      case ScopeEnum["région"]:
        filterTracker("codeRegion", { value: code, context: "carto" });
        break;
      case ScopeEnum["académie"]:
        filterTracker("codeAcademie", { value: code, context: "carto" });
        break;
      case ScopeEnum["département"]:
        filterTracker("codeDepartement", { value: code, context: "carto" });
        break;
      }

      return handleFilters({
        ...filters,
        ...newFilters,
      });
    },
    // TODO: REFACTO
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [handleFilters, filters]
  );

  if (!Object.keys(ScopeEnum).includes(filters.scope))
    return (
      <Box flex={1} borderRadius={4} border={"1px solid"} borderColor="grey.900" bg="white" p={3}>
        <Center flex={1} flexDirection={"column"} h={"100%"} gap={4}>
          <Text>
            <Highlight query={filters.scope} styles={{ fontWeight: 700, textDecoration: "underline" }}>
              {`Granularité "${filters.scope}" non gérée.`}
            </Highlight>
          </Text>
          <Text>Veuillez en sélectionner une autre dans les filtres.</Text>
        </Center>
      </Box>
    );

  const onExportCsv = async () => {
    downloadCsv(`visualisation_territoriale_${indicateur}_${filters.scope}`, getGraphData(), {
      name: "Nom",
      value: indicateur,
      code: "Code",
    });
  };

  const onExportExcel = async () => {
    downloadExcel(`visualisation_territoriale_${indicateur}_${filters.scope}`, getGraphData(), {
      name: "Nom",
      value: indicateur,
      code: "Code",
    });
  };

  return (
    <Box flex={1} borderRadius={4} border={"1px solid"} borderColor="grey.900" bg="white" p={3}>
      {isLoading || !filters.campagne || !filters.rentreeScolaire ? (
        <Skeleton opacity="0.3" height="100%" />
      ) : (
        <Box>
          <Flex marginStart={"auto"} justifyContent="space-between">
            <Heading as="h2" color={"bluefrance.113"} fontSize={14} fontWeight="500" lineHeight="24px" textTransform="uppercase">
              Visualisation territoriale
            </Heading>
            <Flex flexDirection={"column"} position={"relative"} zIndex={1}>
              <VisuallyHidden as="label" htmlFor="select-indicateur-carto">Sélectionner un indicateur</VisuallyHidden>
              <Select
                id="select-indicateur-carto"
                width="64"
                size="sm"
                variant="newInput"
                bg={"grey.150"}
                onChange={(e) => handleIndicateurChange(e.target.value)}
                value={indicateur}
                borderBottomColor={typeof indicateur !== "undefined" ? "info.525" : ""}
                cursor={"pointer"}
              >
                {indicateurOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label.toUpperCase()}
                  </option>
                ))}
              </Select>
            </Flex>
          </Flex>
          <Flex justifyContent="start" zIndex={1} position={"relative"}>
            <ExportMenuButton onExportCsv={onExportCsv} onExportExcel={onExportExcel} variant="ghost" />
          </Flex>
          <Box mt={"-60px"}>
            <CartoGraph
              graphData={getGraphData()}
              scope={filters.scope}
              customPiecesSteps={getCustomPieces()}
              customColorPalette={getCustomPalette()}
              handleClick={handleClickOnTerritoire}
              selectedScope={{
                type: filters.scope,
                value: getScopeCode(filters) ?? "national",
              }}
            />
          </Box>
        </Box>
      )}
    </Box>
  );
};
