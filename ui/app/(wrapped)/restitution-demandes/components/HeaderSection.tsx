import {
  Card,
  CardBody,
  CardHeader,
  Divider,
  Flex,
  Img,
  Skeleton,
  Text,
} from "@chakra-ui/react";

import { CountStatsDemandes, Filters, StatsDemandes } from "../types";
import { PrimaryFiltersSection } from "./PrimaryFiltersSection";
import { SecondaryFiltersSection } from "./SecondaryFiltersSection";

const Loader = () => (
  <Flex gap={8} flexDirection={"column"} px="8">
    <Flex w="100%" gap={4} mb="8">
      <Flex h="160px" w="100%">
        <Skeleton opacity="0.3" width="100%" height={"100%"}></Skeleton>
      </Flex>
    </Flex>
    <Flex w="100%" gap={4} mb="8">
      <Flex h="184px" w="100%">
        <Skeleton opacity="0.3" width="100%" height={"100%"}></Skeleton>
      </Flex>
    </Flex>
  </Flex>
);

const CountCard = ({
  label,
  value,
  type,
}: {
  label: string;
  value?: {
    total: string;
    scolaire: string;
    apprentissage: string;
    coloration?: string;
  };
  type?:
    | "ouverture_nette"
    | "augmentation_nette"
    | "fermeture"
    | "diminution"
    | undefined;
}) => (
  <Card minW="64" bgColor="grey.975" borderRadius={"7px"}>
    <CardHeader>
      <Flex>
        {type && <Img height={"20px"} src={`/icons/${type}.svg`} />}
        <Text fontSize="lg" fontWeight="bold" lineHeight={"20px"} ms="2">
          {label}
        </Text>
      </Flex>
    </CardHeader>
    <CardBody py={3}>
      <Flex justify={"space-between"}>
        <Text fontSize="40" fontWeight={"extrabold"}>
          {value?.total ? value?.total : "0"}
        </Text>
        <Flex flexDirection="column" justifyContent={"end"} width="40%">
          <Flex justify={"space-between"} pb="2">
            <Text
              justifyContent="start"
              fontSize="14"
              fontWeight="bold"
              lineHeight={"4"}
            >
              {`${value?.scolaire ? value?.scolaire : 0} `}
            </Text>
            <Text justifyContent="end" fontSize={"12"} lineHeight={"4"}>
              Scolaire
            </Text>
          </Flex>
          <Divider />
          <Flex justify={"space-between"} pt="2">
            <Text
              justifyContent="start"
              fontSize="14"
              fontWeight="bold"
              lineHeight={"4"}
            >
              {`${value?.apprentissage ? value?.apprentissage : 0} `}
            </Text>
            <Text justifyContent="end" fontSize={"12"} lineHeight={"4"}>
              Apprent.
            </Text>
          </Flex>
          {value?.coloration && (
            <>
              <Divider />
              <Flex justify={"space-between"} pt="2">
                <Text
                  justifyContent="start"
                  fontSize="14"
                  fontWeight="bold"
                  lineHeight={"4"}
                >
                  {`${value?.coloration ? value?.coloration : 0} `}
                </Text>
                <Text justifyContent="end" fontSize={"12"} lineHeight={"4"}>
                  Coloration
                </Text>
              </Flex>
            </>
          )}
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
        <Flex gap={4} px={8}>
          <PrimaryFiltersSection
            activeFilters={activeFilters}
            handleFilters={handleFilters}
            filterTracker={filterTracker}
            isLoading={isLoading}
            data={data}
          />
          <CountCard
            label="Ouvertures"
            value={countData?.ouvertures}
            type="ouverture_nette"
          />
          <CountCard
            label="Fermetures"
            value={countData?.fermetures}
            type="fermeture"
          />
          <CountCard
            label="Augmentations"
            value={countData?.augmentations}
            type="augmentation_nette"
          />
          <CountCard
            label="Diminutions"
            value={countData?.diminutions}
            type="diminution"
          />
          <CountCard label="AMI / CMA" value={countData?.amiCMAs} />
          <CountCard label="FCIL" value={countData?.FCILs} />
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
