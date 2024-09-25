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
import Link from "next/link";
import { usePlausible } from "next-plausible";
import { useCallback, useState } from "react";
import { ScopeEnum } from "shared";

import { Legend } from "@/components/Legend";
import { OrderIcon } from "@/components/OrderIcon";
import { formatLargeNumber, formatPercentage } from "@/utils/formatUtils";

import {
  FiltersStatsPilotageIntentions,
  OrderRepartitionPilotageIntentions,
  RepartitionPilotageIntentionsDomaines,
  RepartitionPilotageIntentionsZonesGeographiques,
} from "../../types";
import { DisplayAnalyseComparativeEnum } from "../displayTypeEnum";

const SEUIL_RATIO_FERMETURE: number = 0.33;

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
  filters,
}: {
  zonesGeographiques?: RepartitionPilotageIntentionsZonesGeographiques;
  domaines?: RepartitionPilotageIntentionsDomaines;
  order: Partial<OrderRepartitionPilotageIntentions>;
  setSearchParams: (params: {
    order?: Partial<OrderRepartitionPilotageIntentions>;
  }) => void;
  filters?: Partial<FiltersStatsPilotageIntentions>;
}) => {
  const trackEvent = usePlausible();
  const [displayType, setDisplayType] = useState<DisplayAnalyseComparativeEnum>(
    DisplayAnalyseComparativeEnum.zone_geographique
  );

  const getScopeKey = () => {
    if (filters?.scope) return "codeRegion";
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

  const compareFilters = (
    itemCode: string,
    filterCode?: string | Array<string>
  ) => {
    if (typeof filterCode === "string") {
      return itemCode === filterCode;
    } else if (Array.isArray(filterCode)) {
      return filterCode.includes(itemCode);
    }
    return false;
  };

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

  const getTauxTransfoBgColor = useCallback(
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
    <Flex direction={"column"} gap={6}>
      <Flex direction={"row"} justify={"space-between"}>
        <Heading as="h3" fontWeight={700} fontSize={20}>
          Analyse comparative
        </Heading>
        <Button
          variant={"ghost"}
          color={"bluefrance.113"}
          leftIcon={<Icon icon="ri:download-line" />}
          as={Link}
          href={"__TODO__"}
          isDisabled
          target="_blank"
        >
          Exporter
        </Button>
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
            <Thead
              position={"sticky"}
              top={0}
              bgColor="white"
              boxShadow={"0px 2px 1px 1px black;"}
            >
              <Tr>
                <Th cursor={"pointer"} onClick={() => handleOrder("libelle")}>
                  <OrderIcon {...order} column="libelle" />
                  {isZoneGeographiqueSelected ? filters?.scope : "Domaine"}
                </Th>
                <Th
                  isNumeric
                  cursor={"pointer"}
                  onClick={() => handleOrder("placesTransformees")}
                >
                  <OrderIcon {...order} column="placesTransformees" />
                  Places transformées
                </Th>
                <Th
                  isNumeric
                  cursor={"pointer"}
                  onClick={() => handleOrder("effectif")}
                >
                  <OrderIcon {...order} column="effectif" />
                  Effectif en entrée
                </Th>
                <Th
                  isNumeric
                  cursor={"pointer"}
                  onClick={() => handleOrder("tauxTransformation")}
                >
                  <OrderIcon {...order} column="tauxTransformation" />
                  Taux de transformation
                </Th>
                <Th
                  isNumeric
                  cursor={"pointer"}
                  onClick={() => handleOrder("tauxTransformationOuvertures")}
                >
                  <OrderIcon {...order} column="tauxTransformationOuvertures" />
                  dont ouvertures
                </Th>
                <Th
                  isNumeric
                  cursor={"pointer"}
                  onClick={() => handleOrder("tauxTransformationFermetures")}
                >
                  <OrderIcon {...order} column="tauxTransformationFermetures" />
                  dont fermetures
                </Th>
                <Th
                  isNumeric
                  cursor={"pointer"}
                  onClick={() => handleOrder("tauxTransformationColorations")}
                >
                  <OrderIcon
                    {...order}
                    column="tauxTransformationColorations"
                  />
                  dont colorations
                </Th>
                <Th
                  isNumeric
                  cursor={"pointer"}
                  onClick={() => handleOrder("solde")}
                >
                  <OrderIcon {...order} column="solde" />
                  solde
                </Th>
                <Th
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
                  const filterValue = isZoneGeographiqueSelected
                    ? filters![getScopeKey()]
                    : filters!["codeNsf"];

                  const trBgColor = compareFilters(item.code, filterValue)
                    ? "blueecume.400_hover !important"
                    : "";

                  const tdBgColor = compareFilters(item.code, filterValue)
                    ? "inherit !important"
                    : "";

                  const trColor = compareFilters(item.code, filterValue)
                    ? "white"
                    : "inherit";

                  const color = compareFilters(item.code, filterValue)
                    ? "inherit"
                    : "black";

                  return (
                    <Tr key={key} bgColor={trBgColor} color={trColor}>
                      <Td
                        bgColor={tdBgColor}
                        color={color}
                        border={"none !important"}
                      >
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
                      <Td
                        bgColor={tdBgColor}
                        border={"none !important"}
                        color={color}
                        isNumeric
                      >
                        {formatLargeNumber(item.placesTransformees)}
                      </Td>
                      <Td
                        bgColor={tdBgColor}
                        border={"none !important"}
                        color={color}
                        isNumeric
                      >
                        {formatLargeNumber(item.effectif, "\u00A0", "-")}
                      </Td>
                      <Td
                        bgColor={getTauxTransfoBgColor(item.tauxTransformation)}
                        border={"none !important"}
                        color={"black"}
                        isNumeric
                      >
                        {formatPercentage(item.tauxTransformation, 1, "-")}
                      </Td>
                      <Td
                        width={24}
                        maxWidth={24}
                        bgColor={tdBgColor}
                        border={"none !important"}
                        color={color}
                        isNumeric
                      >
                        {formatPercentage(
                          item.tauxTransformationOuvertures,
                          1,
                          "-"
                        )}
                      </Td>
                      <Td
                        width={24}
                        maxWidth={24}
                        bgColor={tdBgColor}
                        border={"none !important"}
                        color={color}
                        isNumeric
                      >
                        {formatPercentage(
                          item.tauxTransformationFermetures,
                          1,
                          "-"
                        )}
                      </Td>
                      <Td
                        width={24}
                        maxWidth={24}
                        bgColor={tdBgColor}
                        border={"none !important"}
                        color={color}
                        isNumeric
                      >
                        {formatPercentage(
                          item.tauxTransformationColorations,
                          1,
                          "-"
                        )}
                      </Td>
                      <Td
                        width={24}
                        maxWidth={24}
                        bgColor={tdBgColor}
                        border={"none !important"}
                        color={color}
                        isNumeric
                      >
                        {item.solde}
                      </Td>
                      <Td
                        color={color}
                        bgColor={
                          item.ratioFermeture !== undefined &&
                          item.ratioFermeture < SEUIL_RATIO_FERMETURE
                            ? customPalette[0]
                            : "inherit"
                        }
                        border={"none !important"}
                        isNumeric
                      >
                        {formatPercentage(item.ratioFermeture, 1, "-")}
                      </Td>
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
                <Td
                  w={"20%"}
                  textTransform={"uppercase"}
                  border={"none !important"}
                >
                  {dataToDisplay["Total"]?.libelle}
                </Td>
                <Td border={"none !important"} isNumeric>
                  {formatLargeNumber(
                    dataToDisplay["Total"]?.placesTransformees
                  )}
                </Td>
                <Td border={"none !important"} isNumeric>
                  {formatLargeNumber(
                    dataToDisplay["Total"]?.effectif,
                    "\u00A0",
                    "-"
                  )}
                </Td>
                <Td
                  bgColor={getTauxTransfoBgColor(
                    dataToDisplay["Total"]?.tauxTransformation
                  )}
                  color={"black"}
                  border={"none !important"}
                  isNumeric
                >
                  {formatPercentage(
                    dataToDisplay["Total"]?.tauxTransformation,
                    1,
                    "-"
                  )}
                </Td>
                <Td border={"none !important"} isNumeric>
                  {formatPercentage(
                    dataToDisplay["Total"]?.tauxTransformationOuvertures,
                    1,
                    "-"
                  )}
                </Td>
                <Td border={"none !important"} isNumeric>
                  {formatPercentage(
                    dataToDisplay["Total"]?.tauxTransformationFermetures,
                    1,
                    "-"
                  )}
                </Td>
                <Td border={"none !important"} isNumeric>
                  {formatPercentage(
                    dataToDisplay["Total"]?.tauxTransformationColorations,
                    1,
                    "-"
                  )}
                </Td>
                <Td border={"none !important"} isNumeric>
                  {dataToDisplay["Total"]?.solde}
                </Td>
                <Td
                  bgColor={
                    !dataToDisplay["Total"]?.ratioFermeture ||
                    (dataToDisplay["Total"]?.ratioFermeture &&
                      dataToDisplay["Total"]?.ratioFermeture < 0.33)
                      ? customPalette[0]
                      : "inherit"
                  }
                  border={"none !important"}
                  isNumeric
                >
                  {formatPercentage(
                    dataToDisplay["Total"]?.ratioFermeture,
                    1,
                    "-"
                  )}
                </Td>
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
