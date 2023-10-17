import {
  Card,
  CardBody,
  CardHeader,
  Divider,
  Flex,
  Text,
} from "@chakra-ui/react";
import { ApiType } from "shared";

import { api } from "../../../../../api.client";

const CountCard = ({
  label,
  subLabel,
  value,
}: {
  label: string;
  subLabel?: string;
  value?: {
    total: number;
    scolaire: number;
    apprentissage: number;
    coloration?: number;
  };
}) => (
  <Card minW="52" bgColor="white" borderRadius={5}>
    <CardHeader px={3} pt={2} pb={1}>
      <Flex flexDirection="column" minH="42px">
        <Text fontSize="lg" fontWeight="bold">
          {label}
        </Text>
        <Text fontSize="sm">{subLabel}</Text>
      </Flex>
    </CardHeader>
    <CardBody pb={3} pt={0} px={3}>
      <Flex flexDirection="column">
        <Flex pb={4}>
          <Text fontSize="36" fontWeight={"extrabold"}>
            {value?.total ? value?.total : "0"}
          </Text>
        </Flex>
        <Flex flexDirection="column" justifyContent={"end"}>
          <Flex justify={"space-between"} pb="2">
            <Text
              justifyContent="start"
              fontSize="12"
              fontWeight="bold"
              lineHeight={"4"}
            >
              {`${value?.scolaire ? value?.scolaire : 0} `}
            </Text>
            <Text justifyContent="end" fontSize={"12"} lineHeight={"4"}>
              scolaire
            </Text>
          </Flex>
          <Divider />
          <Flex justify={"space-between"} pt="2">
            <Text
              justifyContent="start"
              fontSize="12"
              fontWeight="bold"
              lineHeight={"4"}
            >
              {`${value?.apprentissage ? value?.apprentissage : 0} `}
            </Text>
            <Text justifyContent="end" fontSize={"12"} lineHeight={"4"}>
              apprentissage
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </CardBody>
  </Card>
);

export const CountersSection = ({
  countData,
}: {
  countData?: ApiType<typeof api.countStatsDemandes>;
}) => {
  return (
    <>
      <CountCard label="Places ouvertes" value={countData?.ouvertures} />
      <CountCard label="Places fermées" value={countData?.fermetures} />
      <CountCard
        label="AMI / CMA"
        subLabel="Places ouvertes"
        value={countData?.amiCMAs}
      />
      <CountCard
        label="FCIL"
        subLabel="Places ouvertes"
        value={countData?.FCILs}
      />
    </>
  );
};
