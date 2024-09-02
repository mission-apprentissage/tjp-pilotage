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
  Tr,
} from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import { useState } from "react";

import { DisplayAnalyseComparativeEnum } from "@/app/(wrapped)/intentions/pilotage-refonte/main/displayTypeEnum";
import {
  RepartitionPilotageIntentionsDomaines,
  RepartitionPilotageIntentionsZonesGeographiques,
} from "@/app/(wrapped)/intentions/pilotage-refonte/types";

import { formatPercentage } from "../../../../../../utils/formatUtils";

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
}: {
  zonesGeographiques?: RepartitionPilotageIntentionsZonesGeographiques;
  domaines?: RepartitionPilotageIntentionsDomaines;
}) => {
  const [displayType, setDisplayType] = useState<DisplayAnalyseComparativeEnum>(
    DisplayAnalyseComparativeEnum.zone_geographique
  );

  const isZoneGeographiqueSelected =
    displayType === DisplayAnalyseComparativeEnum.zone_geographique;

  const isDomaineSelected =
    displayType === DisplayAnalyseComparativeEnum.domaine;

  const dataToDisplay =
    (isZoneGeographiqueSelected ? zonesGeographiques : domaines) ?? {};

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
      <Flex>
        <Table>
          <Thead>
            <Tr>
              <Th>{isZoneGeographiqueSelected ? "Région" : "Domaine"}</Th>
              <Th>Places transformées</Th>
              <Th>Places effectivement occupées</Th>
              <Th>Taux de transformation</Th>
              <Th>dont ouvertures</Th>
              <Th>dont fermetures</Th>
              <Th>dont colorations</Th>
              <Th>solde</Th>
              <Th>ratio fermetures</Th>
            </Tr>
          </Thead>
          <Tbody>
            {Object.keys(dataToDisplay).map((key) => {
              const item = dataToDisplay[key];
              return (
                <Tr key={key}>
                  <Td>{item.libelle}</Td>
                  <Td>{item.placesTransformees}</Td>
                  <Td>{item.placesEffectivementOccupees}</Td>
                  <Td>{formatPercentage(item.tauxTransformation, 2)}</Td>
                  <Td>
                    {formatPercentage(item.tauxTransformationOuvertures, 2)}
                  </Td>
                  <Td>
                    {formatPercentage(item.tauxTransformationFermetures, 2)}
                  </Td>
                  <Td>{item.tauxTransformationColorations}</Td>
                  <Td>{item.solde}</Td>
                  <Td>{item.ratioFermeture}</Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </Flex>
    </Flex>
  );
};
