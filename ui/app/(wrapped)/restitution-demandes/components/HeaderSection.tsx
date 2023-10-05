import {
  Card,
  CardBody,
  CardHeader,
  Flex,
  Skeleton,
  Text,
} from "@chakra-ui/react";

import { CountStatsDemandes, Filters, StatsDemandes } from "../types";
import { PrimaryFiltersSection } from "./PrimaryFiltersSection";
import { SecondaryFiltersSection } from "./SecondaryFiltersSection";

const CountCard = ({ label, value }: { label: string; value?: string }) => (
  <Card minW="40" bgColor="grey.975" borderRadius={"7px"}>
    <CardHeader>
      <Text fontSize="lg" fontWeight="bold">
        {label}
      </Text>
    </CardHeader>
    <CardBody py={3}>
      <Text fontSize="40" fontWeight={"extrabold"}>
        {value ?? 0}
      </Text>
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
}) => {
  if (isLoading) return <Skeleton />;

  return (
    <Flex gap={8} flexDirection={"column"}>
      <Flex gap={8} px={8}>
        <PrimaryFiltersSection
          activeFilters={activeFilters}
          handleFilters={handleFilters}
          filterTracker={filterTracker}
          isLoading={isLoading}
          data={data}
        />
        <CountCard label="Ouvertures" value={countData?.ouvertures} />
        <CountCard label="Fermetures" value={countData?.fermetures} />
        <CountCard label="Augmentations" value={countData?.augmentations} />
        <CountCard label="Diminutions" value={countData?.diminutions} />
        <CountCard label="AMI / CMA" value={countData?.amiCMAs} />
        <CountCard label="FCIL" value={countData?.FCILs} />
      </Flex>
      <SecondaryFiltersSection
        activeFilters={activeFilters}
        handleFilters={handleFilters}
        filterTracker={filterTracker}
        isLoading={isLoading}
        data={data}
      />
    </Flex>
  );
};
