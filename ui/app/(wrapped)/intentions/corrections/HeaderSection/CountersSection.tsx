import { Card, CardBody, CardHeader, Flex, Text } from "@chakra-ui/react";

import { CorrectionsStats } from "../types";

const formatEcart = (value: number) => {
  if (value > 0) return <Text>{`+${value}`}</Text>;
  return <Text>{value}</Text>;
};

const CountCard = ({
  label,
  subLabel,
  value,
  isEcart,
}: {
  label: string;
  subLabel?: string;
  value?: number;
  isEcart?: boolean;
}) => (
  <Card minW={[null, null, "52"]} flex={1} bgColor="white" borderRadius={5}>
    <CardHeader px={3} pt={2} pb={1}>
      <Flex direction="column" minH="42px">
        <Flex>
          <Text fontSize="lg" fontWeight="bold" lineHeight={"20px"}>
            {label}
          </Text>
        </Flex>
        <Text fontSize="sm">{subLabel}</Text>
      </Flex>
    </CardHeader>
    <CardBody pb={3} pt={0} px={3}>
      <Flex direction="column">
        <Flex pb={4}>
          <Text fontSize="48" fontWeight={"extrabold"}>
            {isEcart ? formatEcart(value ?? 0) : value ?? "0"}
          </Text>
        </Flex>
      </Flex>
    </CardBody>
  </Card>
);

export const CountersSection = ({
  countData,
}: {
  countData?: CorrectionsStats;
}) => {
  return (
    <Flex
      direction={"row"}
      gap={4}
      overflowY={"auto"}
      pb={2}
      flexWrap={["wrap", null, "nowrap"]}
    >
      <Flex gap={4} width="100%">
        <CountCard
          label="Nombre de correction"
          value={countData?.nbCorrections}
        />
        <CountCard label="Nombre de reports" value={countData?.nbReports} />
        <CountCard
          label="Nombre d'annulation"
          value={countData?.nbAnnulations}
        />
        <CountCard
          label="Nombre de modifications"
          value={countData?.nbModifications}
        />
        <CountCard
          label="Écart capacité scolaire"
          value={countData?.ecartScolaire}
          isEcart
        />
        <CountCard
          label="Écart capacité apprentissage"
          value={countData?.ecartApprentissage}
          isEcart
        />
      </Flex>
    </Flex>
  );
};
