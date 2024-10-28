import { Box, Center, Flex, Highlight, Select, Skeleton, Text, useToken } from "@chakra-ui/react";
import { useCallback } from "react";
import { ScopeEnum } from "shared";

import { useScopeCode } from "@/app/(wrapped)/intentions/pilotage/hooks";
import type {
  FiltersStatsPilotageIntentions,
  StatsPilotageIntentions,
} from "@/app/(wrapped)/intentions/pilotage/types";
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
}: {
  indicateur: IndicateurType;
  handleIndicateurChange: (indicateur: string) => void;
  indicateurOptions: {
    label: string;
    value: string;
    isDefault: boolean;
  }[];
  filters: FiltersStatsPilotageIntentions;
  handleFilters: (filters: Partial<FiltersStatsPilotageIntentions>) => void;
  data: StatsPilotageIntentions | undefined;
  isLoading?: boolean;
}) => {
  const { code: scopeCode } = useScopeCode(filters);

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

    return Object.values(data?.all).map((territoire) => ({
      // @ts-expect-error TODO
      name: territoire.libelle,
      // @ts-expect-error TODO
      parentName: territoire.libelleAcademie,
      value:
        // @ts-expect-error TODO
        territoire.effectif || indicateur != "tauxTransformation"
          ? // @ts-expect-error TODO
            formatPercentageWithoutSign(territoire[indicateur], 1)
          : undefined,
      // @ts-expect-error TODO
      code: territoire.code,
    }));
  }, [data, filters, indicateur]);

  const handleClickOnTerritoire = useCallback(
    (code: string | undefined) =>
      handleFilters({
        scope: filters.scope,
        codeRegion: filters.scope !== ScopeEnum["région"] ? undefined : code,
        codeAcademie: filters.scope !== ScopeEnum["académie"] ? undefined : code,
        codeDepartement: filters.scope !== ScopeEnum["département"] ? undefined : code,
      }),
    [handleFilters, filters, scopeCode]
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

  return (
    <Box flex={1} borderRadius={4} border={"1px solid"} borderColor="grey.900" bg="white" p={3}>
      {isLoading || !filters.campagne || !filters.rentreeScolaire ? (
        <Skeleton opacity="0.3" height="100%" />
      ) : (
        <Box>
          <Flex marginStart={"auto"} justifyContent="space-between">
            <Text color={"bluefrance.113"} fontWeight={700}>
              VISUALISATION TERRITORIALE
            </Text>
            <Flex flexDirection={"column"} position={"relative"} zIndex={1}>
              <Select
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
            <ExportMenuButton
              onExportCsv={async () => {
                downloadCsv(`visualisation_territoriale_${indicateur}_${filters.scope}`, getGraphData(), {
                  name: "Nom",
                  value: indicateur,
                  code: "Code",
                });
              }}
              onExportExcel={async () => {
                downloadExcel(`visualisation_territoriale_${indicateur}_${filters.scope}`, getGraphData(), {
                  name: "Nom",
                  value: indicateur,
                  code: "Code",
                });
              }}
              variant="ghost"
            />
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
                value: scopeCode ?? "national",
              }}
            />
          </Box>
        </Box>
      )}
    </Box>
  );
};
