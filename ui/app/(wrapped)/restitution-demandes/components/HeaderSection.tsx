import {
  Card,
  CardBody,
  CardHeader,
  Divider,
  Flex,
  Skeleton,
  Text,
} from "@chakra-ui/react";

import { CountStatsDemandes, Filters, StatsDemandes } from "../types";
import { PrimaryFiltersSection } from "./PrimaryFiltersSection";
import { SecondaryFiltersSection } from "./SecondaryFiltersSection";

const Loader = () => (
  <Flex gap={8} flexDirection={"column"}>
    <Flex w="100%" gap={4} mb="8">
      <Flex h="182px" w="100%" gap={4}>
        <Flex minW="532px">
          <Skeleton opacity="0.3" width="100%" height={"100%"}></Skeleton>
        </Flex>
        <Flex minW="52">
          <Skeleton opacity="0.3" width="100%" height={"100%"}></Skeleton>
        </Flex>
        <Flex minW="52">
          <Skeleton opacity="0.3" width="100%" height={"100%"}></Skeleton>
        </Flex>
        <Flex minW="52">
          <Skeleton opacity="0.3" width="100%" height={"100%"}></Skeleton>
        </Flex>
        <Flex minW="52">
          <Skeleton opacity="0.3" width="100%" height={"100%"}></Skeleton>
        </Flex>
      </Flex>
    </Flex>
    <Flex w="100%" gap={4} mb="8">
      <Flex h="140px" w="100%">
        <Skeleton opacity="0.3" width="100%" height={"100%"}></Skeleton>
      </Flex>
    </Flex>
  </Flex>
);

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

export const HeaderSection = ({
  activeFilters,
  handleFilters,
  filterTracker,
  isLoading,
  data,
  countData,
}: {
  activeFilters: Filters;
  handleFilters: (type: keyof Filters, value: Filters[keyof Filters]) => void;
  filterTracker: (filterName: keyof Filters) => () => void;
  isLoading: boolean;
  data?: StatsDemandes;
  countData?: CountStatsDemandes;
}) => (
  <>
    {isLoading ? (
      <Loader />
    ) : (
      <Flex gap={8} flexDirection={"column"}>
        <Flex gap={4}>
          <PrimaryFiltersSection
            activeFilters={activeFilters}
            handleFilters={handleFilters}
            filterTracker={filterTracker}
            isLoading={isLoading}
            data={data}
          />
          <Flex flexDirection={"row"} gap={4} overflowY={"auto"} pb={2}>
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
          </Flex>
        </Flex>
        <SecondaryFiltersSection
          activeFilters={activeFilters}
          handleFilters={handleFilters}
          filterTracker={filterTracker}
          data={data}
        />
      </Flex>
    )}
  </>
);
