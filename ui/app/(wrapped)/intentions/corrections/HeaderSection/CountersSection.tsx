import { Card, CardBody, CardHeader, Flex, Img, Text } from "@chakra-ui/react";

import { CorrectionsStats } from "../types";

const formatEcart = (value: number) => {
  if (value > 0) return <Text>{`+${value}`}</Text>;
  return <Text>{value}</Text>;
};

const CountCard = ({
  label,
  icon,
  iconLink,
  subLabel,
  value,
  isEcart,
}: {
  label: string;
  icon?: React.ReactNode;
  iconLink?: string;
  subLabel?: string;
  value?: number;
  isEcart?: boolean;
}) => (
  <Card minW={[null, null, "52"]} flex={1} bgColor="white" borderRadius={5}>
    <CardHeader px={3} pt={2} pb={1}>
      <Flex flexDirection="column" minH="42px">
        <Flex>
          {iconLink && (
            <Img src={`/icons/${iconLink}.svg`} height="20px" me={2}></Img>
          )}
          {icon}
          <Text fontSize="lg" fontWeight="bold" lineHeight={"20px"}>
            {label}
          </Text>
        </Flex>
        <Text fontSize="sm">{subLabel}</Text>
      </Flex>
    </CardHeader>
    <CardBody pb={3} pt={0} px={3}>
      <Flex flexDirection="column">
        <Flex pb={4}>
          <Text fontSize="36" fontWeight={"extrabold"}>
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
      flexDirection={"row"}
      gap={4}
      overflowY={"auto"}
      pb={2}
      flexWrap={["wrap", null, "nowrap"]}
    >
      <Flex gap={4} width="100%">
        <CountCard
          label="Nombre de correction"
          value={countData?.nbCorrections}
          iconLink={"corrections"}
        />
        <CountCard
          label="Nombre de reports"
          value={countData?.nbReports}
          iconLink={"reports"}
        />
        <CountCard
          label="Nombre d'annulation"
          value={countData?.nbAnnulations}
          iconLink={"annulations"}
        />
        <CountCard
          label="Nombre de modifications"
          value={countData?.nbModifications}
          iconLink={"modifications"}
        />
        <CountCard
          label="Écart capacité scolaire"
          value={countData?.ecartScolaire}
          isEcart
          iconLink={"ecart_scolaire"}
        />
        <CountCard
          label="Écart capacité apprentissage"
          value={countData?.ecartApprentissage}
          isEcart
          iconLink={"ecart_apprentissage"}
        />
      </Flex>
    </Flex>
  );
};
