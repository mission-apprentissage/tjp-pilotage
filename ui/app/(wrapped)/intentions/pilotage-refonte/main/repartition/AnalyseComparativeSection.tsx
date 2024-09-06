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
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
  useToken,
} from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import { usePlausible } from "next-plausible";
import { useCallback, useState } from "react";

import { DisplayTypeEnum } from "@/app/(wrapped)/intentions/pilotage-refonte/main/displayTypeEnum";
import { FiltersStatsPilotageIntentions } from "@/app/(wrapped)/intentions/pilotage-refonte/types";
import { Legend } from "@/components/Legend";
import { OrderIcon } from "@/components/OrderIcon";

import { formatPercentage } from "../../../../../../utils/formatUtils";
import {
  OrderRepartitionPilotageIntentions,
  RepartitionPilotageIntentionsDomaines,
  RepartitionPilotageIntentionsZonesGeographiques,
} from "../../types";
import { DisplayAnalyseComparativeEnum } from "../displayTypeEnum";

const AnalyseComparativeTabsSection = chakra(
  ({
    isZoneGeographiqueSelected,
    isDomaineSelected,
    setDisplayType,
  }: {
    isZoneGeographiqueSelected: boolean;
    isDomaineSelected: boolean;
    setDisplayType: (displayType: DisplayAnalyseComparativeEnum) => void;
  }) => {
    const getTabIndex = () => {
      if (isZoneGeographiqueSelected) return 0;
      if (isDomaineSelected) return 1;
    };

    return (
      <Flex justify={"center"}>
        <Tabs isLazy={true} index={getTabIndex()} variant="blue-border">
          <TabList>
            <Tab
              onClick={() =>
                setDisplayType(DisplayAnalyseComparativeEnum.zone_geographique)
              }
              color={"black"}
            >
              <Flex
                direction={"row"}
                justify={"center"}
                alignItems={"center"}
                p={3}
                gap={2}
              >
                <Icon icon="ri:map-pin-line" />
                <Text fontWeight={isZoneGeographiqueSelected ? 700 : 400}>
                  Par zone géographique
                </Text>
              </Flex>
            </Tab>
            <Tab
              as={Button}
              onClick={() =>
                setDisplayType(DisplayAnalyseComparativeEnum.domaine)
              }
              color={"black"}
            >
              <Flex
                direction={"row"}
                justify={"center"}
                alignItems={"center"}
                p={3}
                gap={2}
              >
                <Icon icon="ri:archive-drawer-line" />
                <Text fontWeight={isDomaineSelected ? 700 : 400}>
                  Par domaine (NSF)
                </Text>
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
}: {
  zonesGeographiques?: RepartitionPilotageIntentionsZonesGeographiques;
  domaines?: RepartitionPilotageIntentionsDomaines;
  order: Partial<OrderRepartitionPilotageIntentions>;
  setSearchParams: (params: {
    displayType?: DisplayTypeEnum;
    filters?: Partial<FiltersStatsPilotageIntentions>;
    order?: Partial<OrderRepartitionPilotageIntentions>;
  }) => void;
}) => {
  const trackEvent = usePlausible();
  const [displayType, setDisplayType] = useState<DisplayAnalyseComparativeEnum>(
    DisplayAnalyseComparativeEnum.zone_geographique
  );

  const isZoneGeographiqueSelected =
    displayType === DisplayAnalyseComparativeEnum.zone_geographique;

  const isDomaineSelected =
    displayType === DisplayAnalyseComparativeEnum.domaine;

  const dataToDisplay =
    (isZoneGeographiqueSelected ? zonesGeographiques : domaines) ?? {};
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

  const getTdBgColor = useCallback(
    (indicateur: number | undefined) => {
      if (typeof indicateur === "undefined") {
        return undefined;
      }
      if (indicateur <= 0.01) return customPalette[0];
      if (indicateur <= 0.02) return customPalette[1];
      if (indicateur <= 0.04) return customPalette[2];
      if (indicateur <= 0.05) return customPalette[3];
      if (indicateur <= 0.06) return customPalette[4];
      if (indicateur > 0.06) return customPalette[5];
    },
    [customPalette]
  );

  const handleOrder = (
    column: OrderRepartitionPilotageIntentions["orderBy"]
  ) => {
    trackEvent("formations:ordre", { props: { colonne: column } });
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
    <Flex direction={"column"} gap={4}>
      <Flex direction={"row"} justify={"space-between"}>
        <Heading as="h3" fontWeight={700} fontSize={20}>
          Analyse comparative
        </Heading>
        <Flex direction={"row"} color={"bluefrance.113"} gap={2} mt={"auto"}>
          <Icon icon={"ri:download-line"} />
          <Text>Exporter</Text>
        </Flex>
      </Flex>
      <Divider w={"100%"} my={6} />
      <AnalyseComparativeTabsSection
        isZoneGeographiqueSelected={isZoneGeographiqueSelected}
        isDomaineSelected={isDomaineSelected}
        setDisplayType={setDisplayType}
      />
      <Flex direction={"column"}>
        <Table>
          <Thead>
            <Tr>
              <Th
                width={"20%"}
                cursor={"pointer"}
                onClick={() => handleOrder("libelle")}
              >
                <OrderIcon {...order} column="libelle" />
                {isZoneGeographiqueSelected ? "Région" : "Domaine"}
              </Th>
              <Th
                maxWidth={"5%"}
                isNumeric
                cursor={"pointer"}
                onClick={() => handleOrder("placesTransformees")}
              >
                <OrderIcon {...order} column="placesTransformees" />
                Places transformées
              </Th>
              <Th
                maxWidth={"5%"}
                isNumeric
                cursor={"pointer"}
                onClick={() => handleOrder("placesEffectivementOccupees")}
              >
                <OrderIcon {...order} column="placesEffectivementOccupees" />
                Places effectivement occupées
              </Th>
              <Th
                maxWidth={"5%"}
                isNumeric
                cursor={"pointer"}
                onClick={() => handleOrder("tauxTransformation")}
              >
                <OrderIcon {...order} column="tauxTransformation" />
                Taux de transformation
              </Th>
              <Th
                maxWidth={"5%"}
                isNumeric
                cursor={"pointer"}
                onClick={() => handleOrder("tauxTransformationOuvertures")}
              >
                <OrderIcon {...order} column="tauxTransformationOuvertures" />
                dont ouvertures
              </Th>
              <Th
                maxWidth={"5%"}
                isNumeric
                cursor={"pointer"}
                onClick={() => handleOrder("tauxTransformationFermetures")}
              >
                <OrderIcon {...order} column="tauxTransformationFermetures" />
                dont fermetures
              </Th>
              <Th
                maxWidth={"5%"}
                isNumeric
                cursor={"pointer"}
                onClick={() => handleOrder("tauxTransformationColorations")}
              >
                <OrderIcon {...order} column="tauxTransformationColorations" />
                dont colorations
              </Th>
              <Th
                maxWidth={"5%"}
                isNumeric
                cursor={"pointer"}
                onClick={() => handleOrder("solde")}
              >
                <OrderIcon {...order} column="solde" />
                solde
              </Th>
              <Th
                maxWidth={"5%"}
                isNumeric
                cursor={"pointer"}
                onClick={() => handleOrder("ratioFermeture")}
              >
                <OrderIcon {...order} column="ratioFermeture" />
                ratio fermetures
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {Object.keys(dataToDisplay)
              .filter((key) => key !== "Total")
              .map((key) => {
                const item = dataToDisplay[key];
                return (
                  <Tr key={key}>
                    <Td>
                      <Tooltip label={item.libelle}>
                        <Text
                          textOverflow={"ellipsis"}
                          overflow={"hidden"}
                          whiteSpace={"break-spaces"}
                          noOfLines={1}
                        >
                          {item.libelle}
                        </Text>
                      </Tooltip>
                    </Td>
                    <Td width={24} maxWidth={24} isNumeric>
                      {item.placesTransformees}
                    </Td>
                    <Td width={24} maxWidth={24} isNumeric>
                      {item.placesEffectivementOccupees}
                    </Td>
                    <Td
                      backgroundColor={getTdBgColor(item.tauxTransformation)}
                      color={"black"}
                      isNumeric
                    >
                      {formatPercentage(item.tauxTransformation, 2)}
                    </Td>
                    <Td width={24} maxWidth={24} isNumeric>
                      {formatPercentage(item.tauxTransformationOuvertures, 2)}
                    </Td>
                    <Td width={24} maxWidth={24} isNumeric>
                      {formatPercentage(item.tauxTransformationFermetures, 2)}
                    </Td>
                    <Td width={24} maxWidth={24} isNumeric>
                      {formatPercentage(item.tauxTransformationColorations, 2)}
                    </Td>
                    <Td width={24} maxWidth={24} isNumeric>
                      {item.solde}
                    </Td>
                    <Td
                      isNumeric
                      bgColor={
                        item.ratioFermeture && item.ratioFermeture < 0.33
                          ? customPalette[0]
                          : "inherit"
                      }
                    >
                      {formatPercentage(item.ratioFermeture, 2)}
                    </Td>
                  </Tr>
                );
              })}
            <Tr borderTop={"2px solid black"} fontWeight={700}>
              <Td width={"20%"} textTransform={"uppercase"}>
                {dataToDisplay["Total"]?.libelle}
              </Td>
              <Td width={24} maxWidth={24} isNumeric>
                {dataToDisplay["Total"]?.placesTransformees}
              </Td>
              <Td width={24} maxWidth={24} isNumeric>
                {dataToDisplay["Total"]?.placesEffectivementOccupees}
              </Td>
              <Td
                backgroundColor={getTdBgColor(
                  dataToDisplay["Total"]?.tauxTransformation
                )}
                color={"black"}
                isNumeric
              >
                {formatPercentage(
                  dataToDisplay["Total"]?.tauxTransformation,
                  2
                )}
              </Td>
              <Td width={24} maxWidth={24} isNumeric>
                {formatPercentage(
                  dataToDisplay["Total"]?.tauxTransformationOuvertures,
                  2
                )}
              </Td>
              <Td width={24} maxWidth={24} isNumeric>
                {formatPercentage(
                  dataToDisplay["Total"]?.tauxTransformationFermetures,
                  2
                )}
              </Td>
              <Td width={24} maxWidth={24} isNumeric>
                {formatPercentage(
                  dataToDisplay["Total"]?.tauxTransformationColorations,
                  2
                )}
              </Td>
              <Td width={24} maxWidth={24} isNumeric>
                {dataToDisplay["Total"]?.solde}
              </Td>
              <Td
                isNumeric
                bgColor={
                  dataToDisplay["Total"]?.ratioFermeture &&
                  dataToDisplay["Total"]?.ratioFermeture < 0.33
                    ? customPalette[0]
                    : "inherit"
                }
              >
                {formatPercentage(dataToDisplay["Total"]?.ratioFermeture, 2)}
              </Td>
            </Tr>
          </Tbody>
        </Table>
        <Flex direction={"row"} justify="space-between" mt={4}>
          <Flex direction={"row"} gap={4}>
            <Text my={"auto"}>Taux de transformation</Text>
            <Legend elements={legendElements} my={"auto"} />
          </Flex>
          <Flex direction={"row"} gap={4}>
            <Text my={"auto"}>Ratio de fermetures</Text>
            <Legend
              elements={[{ label: "< 33%", color: customPalette[0] }]}
              my={"auto"}
            />
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};
