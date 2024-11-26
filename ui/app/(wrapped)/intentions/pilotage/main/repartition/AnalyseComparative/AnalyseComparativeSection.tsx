// @ts-nocheck -- TODO

import {
  Button,
  chakra,
  Divider,
  Flex,
  Heading,
  Tab,
  Table,
  TabList,
  Tabs,
  Tbody,
  Text,
  Thead,
  Tr,
  useToken,
} from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import { usePlausible } from "next-plausible";
import { ScopeEnum } from "shared";

import { DisplayTypeEnum } from "@/app/(wrapped)/intentions/pilotage/main/displayTypeEnum";
import type {
  FiltersStatsPilotageIntentions,
  OrderRepartitionPilotageIntentions,
  RepartitionPilotageIntentionsDomaines,
  RepartitionPilotageIntentionsZonesGeographiques,
} from "@/app/(wrapped)/intentions/pilotage/types";
import { ExportMenuButton } from "@/components/ExportMenuButton";
import { Legend } from "@/components/Legend";
import { downloadCsv, downloadExcel } from "@/utils/downloadExport";

import { HeadlineContent } from "./HeadlineContent";
import { LineContent } from "./LineContent";

const compareFilters = (lineCode: string, filterCode?: string | Array<string>) => {
  if (typeof filterCode === "string") {
    return lineCode === filterCode;
  } else if (Array.isArray(filterCode)) {
    return filterCode.includes(lineCode);
  }
  return false;
};

const AnalyseComparativeTabsSection = chakra(
  ({
    isZoneGeographiqueSelected,
    isDomaineSelected,
    setDisplayType,
  }: {
    isZoneGeographiqueSelected: boolean;
    isDomaineSelected: boolean;
    setDisplayType: (
      displayType: Extract<DisplayTypeEnum, DisplayTypeEnum.zone_geographique | DisplayTypeEnum.domaine>
    ) => void;
  }) => {
    const getTabIndex = () => {
      if (isZoneGeographiqueSelected) return 0;
      if (isDomaineSelected) return 1;
    };

    return (
      <Flex justify={"center"}>
        <Tabs isLazy={true} index={getTabIndex()} variant="blue-border">
          <TabList>
            <Tab onClick={() => setDisplayType(DisplayTypeEnum.zone_geographique)} color={"black"}>
              <Flex direction={"row"} justify={"center"} alignItems={"center"} p={3} gap={2}>
                <Icon icon="ri:map-pin-line" />
                <Text fontWeight={isZoneGeographiqueSelected ? 700 : 400}>Par zone géographique</Text>
              </Flex>
            </Tab>
            <Tab as={Button} onClick={() => setDisplayType(DisplayTypeEnum.domaine)} color={"black"}>
              <Flex direction={"row"} justify={"center"} alignItems={"center"} p={3} gap={2}>
                <Icon icon="ri:archive-drawer-line" />
                <Text fontWeight={isDomaineSelected ? 700 : 400}>Par domaine (NSF)</Text>
              </Flex>
            </Tab>
          </TabList>
        </Tabs>
      </Flex>
    );
  }
);

export const AnalyseComparativeSection = ({
  zonesGeographiques,
  domaines,
  order,
  setSearchParams,
  filters,
  displayType,
  displayZonesGeographiques,
  displayDomaines,
}: {
  zonesGeographiques?: RepartitionPilotageIntentionsZonesGeographiques;
  domaines?: RepartitionPilotageIntentionsDomaines;
  order: Partial<OrderRepartitionPilotageIntentions>;
  setSearchParams: (params: { order?: Partial<OrderRepartitionPilotageIntentions> }) => void;
  filters?: Partial<FiltersStatsPilotageIntentions>;
  displayType: DisplayTypeEnum;
  displayZonesGeographiques: () => void;
  displayDomaines: () => void;
}) => {
  const trackEvent = usePlausible();

  const setDisplayType = (
    displayType: Extract<DisplayTypeEnum, DisplayTypeEnum.zone_geographique | DisplayTypeEnum.domaine>
  ) => {
    trackEvent("pilotage-transformation:analyse-comparative-tabs", {
      props: { type: displayType },
    });
    if (displayType === DisplayTypeEnum.zone_geographique) {
      displayZonesGeographiques();
    } else {
      displayDomaines();
    }
  };

  const getScopeKey = () => {
    if (!filters?.scope) return "codeRegion";
    switch (filters?.scope) {
      case ScopeEnum["académie"]:
        return "codeAcademie";
      case ScopeEnum["département"]:
        return "codeDepartement";
      case ScopeEnum["région"]:
      default:
        return "codeRegion";
    }
  };

  const isZoneGeographiqueSelected = displayType === DisplayTypeEnum.zone_geographique;

  const isDomaineSelected = displayType === DisplayTypeEnum.domaine;

  const dataToDisplay = (isZoneGeographiqueSelected ? zonesGeographiques : domaines) ?? {};

  const customPalette = [
    useToken("colors", "pilotage.red !important"),
    useToken("colors", "pilotage.orange !important"),
    useToken("colors", "pilotage.yellow !important"),
    useToken("colors", "pilotage.green.1 !important"),
    useToken("colors", "pilotage.green.2 !important"),
    useToken("colors", "pilotage.green.3 !important"),
  ];

  const legendElements = [
    { label: "< 1%", color: customPalette[0] },
    { label: "< 2%", color: customPalette[1] },
    { label: "< 4%", color: customPalette[2] },
    { label: "< 5%", color: customPalette[3] },
    { label: "< 6%", color: customPalette[4] },
    { label: "> 6%", color: customPalette[5] },
  ];

  const getTauxTransfoBgColor = (indicateur: number | undefined) => {
    if (typeof indicateur === "undefined") {
      return undefined;
    }
    if (indicateur <= 0.01) return customPalette[0];
    if (indicateur <= 0.02) return customPalette[1];
    if (indicateur <= 0.04) return customPalette[2];
    if (indicateur <= 0.05) return customPalette[3];
    if (indicateur <= 0.06) return customPalette[4];
    if (indicateur > 0.06) return customPalette[5];
  };

  const handleOrder = (column: OrderRepartitionPilotageIntentions["orderBy"]) => {
    trackEvent("pilotage-transformation:formations-ordre", {
      props: { colonne: column },
    });
    if (order?.orderBy !== column) {
      setSearchParams({ order: { order: "desc", orderBy: column } });
      return;
    }
    setSearchParams({
      order: {
        order: order?.order === "asc" ? "desc" : "asc",
        orderBy: column,
      },
    });
  };

  return (
    <Flex direction={"column"} gap={6}>
      <Flex direction={"row"} justify={"space-between"}>
        <Heading as="h3" fontWeight={700} fontSize={20}>
          Analyse comparative
        </Heading>
        <ExportMenuButton
          color={"bluefrance.113"}
          onExportCsv={async () => {
            trackEvent("pilotage-transformation:analyse-comparative-export", {
              props: { type: "csv" },
            });
            downloadCsv(
              `analyse_comparative_${isZoneGeographiqueSelected ? filters?.scope : "domaine"}`,
              Object.values(dataToDisplay),
              {
                libelle: "Libellé",
                code: "Code",
                effectif: "Effectif",
                placesTransformees: "Places transformées",
                tauxTransformation: "Taux de transformation",
                placesOuvertes: "Places ouvertes",
                placesFermees: "Places fermées",
                placesColoreesOuvertes: "Places colorées ouvertes",
                placesColoreesFermees: "Places colorées fermées",
                solde: "Solde",
                ratioFermeture: "Ratio de fermeture",
              }
            );
          }}
          onExportExcel={async () => {
            trackEvent("pilotage-transformation:analyse-comparative-export", {
              props: { type: "xslx" },
            });
            downloadExcel(
              `analyse_comparative_${isZoneGeographiqueSelected ? filters?.scope : "domaine"}`,
              Object.values(dataToDisplay),
              {
                libelle: "Libellé",
                code: "Code",
                effectif: "Effectif",
                placesTransformees: "Places transformées",
                tauxTransformation: "Taux de transformation",
                placesOuvertes: "Places ouvertes",
                placesFermees: "Places fermées",
                placesColoreesOuvertes: "Places colorées ouvertes",
                placesColoreesFermees: "Places colorées fermées",
                solde: "Solde",
                ratioFermeture: "Ratio de fermeture",
              }
            );
          }}
          variant="ghost"
        />
      </Flex>
      <Divider w={"100%"} />
      <AnalyseComparativeTabsSection
        isZoneGeographiqueSelected={isZoneGeographiqueSelected}
        isDomaineSelected={isDomaineSelected}
        setDisplayType={setDisplayType}
      />
      <Flex direction={"column"}>
        <Flex maxH={"650"} overflowY="auto" position="relative">
          <Table>
            <Thead position={"sticky"} top={0} bgColor="white" boxShadow={"0px 2px 1px 1px black;"}>
              <HeadlineContent
                filters={filters}
                order={order}
                handleOrder={handleOrder}
                isZoneGeographiqueSelected={isZoneGeographiqueSelected}
              />
            </Thead>
            <Tbody>
              {Object.keys(dataToDisplay)
                .filter((key) => key !== "Total")
                .map((key) => {
                  const item = dataToDisplay[key];
                  const filterValue = isZoneGeographiqueSelected ? filters![getScopeKey()] : filters!["codeNsf"];

                  const trBgColor = compareFilters(item.code, filterValue) ? "blueecume.400_hover !important" : "";

                  const tdBgColor = compareFilters(item.code, filterValue) ? "inherit !important" : "";

                  const trColor = compareFilters(item.code, filterValue) ? "white" : "inherit";

                  const color = compareFilters(item.code, filterValue) ? "inherit" : "black";

                  return (
                    <Tr key={key} bgColor={trBgColor} color={trColor}>
                      <LineContent
                        tdBgColor={tdBgColor}
                        tdColor={color}
                        getTauxTransfoBgColor={getTauxTransfoBgColor}
                        line={item}
                      />
                    </Tr>
                  );
                })}
              <Tr
                border={"none !important"}
                boxShadow={"0px -2px 1px 1px black;"}
                zIndex="200"
                fontWeight={700}
                position={"sticky"}
                bottom={-0.5}
                bgColor="white"
              >
                <LineContent getTauxTransfoBgColor={getTauxTransfoBgColor} line={dataToDisplay["Total"]} />
              </Tr>
            </Tbody>
          </Table>
        </Flex>
        <Flex direction={"row"} justify="space-between" mt={4}>
          <Flex direction={"row"} gap={4}>
            <Text my={"auto"}>Taux de transformation</Text>
            <Legend elements={legendElements} my={"auto"} />
          </Flex>
          <Flex direction={"row"} gap={4}>
            <Text my={"auto"}>Ratio de fermetures</Text>
            <Legend elements={[{ label: "< 33%", color: customPalette[0] }]} my={"auto"} />
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};
