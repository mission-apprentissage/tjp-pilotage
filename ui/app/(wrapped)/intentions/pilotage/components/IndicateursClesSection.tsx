import { Icon, TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";
import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Flex,
  Grid,
  GridItem,
  Img,
  SimpleGrid,
  Skeleton,
  Text,
} from "@chakra-ui/react";
import { ReactNode } from "react";

import { PilotageTransformationStats, Scope } from "../types";

const Loader = () => {
  return (
    <>
      <Box mt={12}>
        <Flex mt={8} height={"168px"}>
          <Grid gap={5} templateColumns="repeat(3, 1fr)" width="100%">
            <GridItem colSpan={2}>
              <Flex flexDirection={"column"} gap={5}>
                <Card height={"2xs"}>
                  <CardBody py="2" px="3">
                    <Skeleton opacity={0.3} height={"100%"} />
                  </CardBody>
                </Card>
                <SimpleGrid spacing={5} columns={[2]}>
                  <Card height={"3xs"}>
                    <CardBody py="2" px="3">
                      <Skeleton opacity={0.3} height={"100%"} />
                    </CardBody>
                  </Card>

                  <Card height={"3xs"}>
                    <CardBody py="2" px="3">
                      <Skeleton opacity={0.3} height={"100%"} />
                    </CardBody>
                  </Card>
                </SimpleGrid>
              </Flex>
            </GridItem>
            <GridItem>
              <Flex flexDirection={"column"} gap={5}>
                <Card height={"2xs"}>
                  <CardBody py="2" px="3">
                    <Skeleton opacity={0.3} height={"100%"} />
                  </CardBody>
                </Card>
                <Card height={"3xs"}>
                  <CardBody py="2" px="3">
                    <Skeleton opacity={0.3} height={"100%"} />
                  </CardBody>
                </Card>
              </Flex>
            </GridItem>
          </Grid>
        </Flex>
      </Box>
    </>
  );
};

const DrapeauFrancaisIcon = ({ ...props }) => (
  <Icon boxSize={4} {...props}>
    <svg
      width="20"
      height="13"
      viewBox="0 0 20 13"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
    >
      <rect x="0.951111" width="20" height="13" fill="url(#pattern0)" />
      <defs>
        <pattern
          id="pattern0"
          patternContentUnits="objectBoundingBox"
          width="1"
          height="1"
        >
          <use
            xlinkHref="#image0_2362_2536"
            transform="matrix(0.00446964 0 0 0.00666667 -0.00283401 0)"
          />
        </pattern>
        <image
          id="image0_2362_2536"
          width="225"
          height="150"
          xlinkHref="data:image/png;base64,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"
        />
      </defs>
    </svg>
  </Icon>
);
const Delta = ({ delta }: { delta: number | null }) => {
  let deltaIcon;

  if (delta != null) {
    if (delta < 0)
      deltaIcon = (
        <Flex>
          <TriangleDownIcon
            mt={1}
            me={2}
            boxSize={4}
            color={"orange.warning"}
          />
          <Text>{`${delta} pts`}</Text>
        </Flex>
      );
    else if (delta === 0)
      deltaIcon = (
        <Flex>
          <Text>{`+${delta} pts`}</Text>
        </Flex>
      );
    else
      deltaIcon = (
        <Flex>
          <TriangleUpIcon
            mt={1}
            me={2}
            boxSize={4}
            color={"pilotage.green.3"}
          />
          <Text>{`+${delta} pts`}</Text>
        </Flex>
      );
  } else {
    deltaIcon = null;
  }

  return (
    <Flex fontSize={12} color={"#96A6D8"}>
      {deltaIcon}
      <Flex ms="auto">
        <DrapeauFrancaisIcon mt={1.5} mx={1} />
      </Flex>
    </Flex>
  );
};

const ProgressBar = ({
  percentage,
  colorScheme = "bluefrance.525",
  leftLabel,
  rightLabel,
}: {
  percentage: number;
  colorScheme?: string;
  leftLabel?: string | number;
  rightLabel?: string | number;
}) => {
  return (
    <Flex flexDirection={"column"}>
      <Flex
        w="100%"
        bgColor="gray.100"
        justifyContent={"space-between"}
        borderRadius={"4px"}
      >
        <Flex
          w={`${percentage < 100 ? percentage : 100}%`}
          bgColor={colorScheme}
          fontSize="10px"
          overflow={"visible"}
          height="15px"
          borderLeftRadius={"inherit"}
          borderRightRadius={percentage >= 100 ? "inherit" : "none"}
        >
          <Text
            textOverflow={"hidden"}
            whiteSpace={"nowrap"}
            lineHeight="12px"
            my="auto"
            fontSize="10px"
            ps={1}
          >
            {leftLabel}
          </Text>
        </Flex>
        <Flex
          w={`${100 - percentage > 0 ? 100 - percentage : 0}%`}
          fontSize="10px"
          overflow={"visible"}
          height="15px"
          justifyContent={"end"}
          borderLeftRadius={percentage === 0 ? "inherit" : "none"}
          borderRightRadius={percentage >= 100 ? "inherit" : "none"}
        >
          <Text
            textOverflow={"hidden"}
            whiteSpace={"nowrap"}
            lineHeight="12px"
            my="auto"
            fontSize="10px"
            pe={1}
          >
            {rightLabel}
          </Text>
        </Flex>
      </Flex>
    </Flex>
  );
};

const StatCard = ({
  label,
  className,
  children,
  icon,
  minH = "2xs",
}: {
  label: string;
  className?: string;
  children: ReactNode;
  icon?: string;
  minH?: string;
}) => {
  return (
    <Card className={className} minH={minH} p={0}>
      <CardHeader p={4}>
        <Flex>
          {icon && <Img alt="" h="20px" src={`/icons/${icon}.svg`} me={2} />}
          <Text
            color="bluefrance.113"
            fontSize={"14px"}
            fontWeight={700}
            textTransform="uppercase"
          >
            {label}
          </Text>
        </Flex>
      </CardHeader>
      <CardBody py="2" px="3" minH="3">
        {children}
      </CardBody>
    </Card>
  );
};

export const IndicateursClesSection = ({
  data,
  isLoading,
  scope,
}: {
  data?: PilotageTransformationStats;
  isLoading: boolean;
  scope?: { type: Scope; value: string | undefined };
}) => {
  const getScopedData = (
    status: "submitted" | "draft" | "all",
    indicateur:
      | "tauxTransformation"
      | "countDemande"
      | "differenceCapaciteScolaire"
      | "differenceCapaciteApprentissage"
      | "placesOuvertesScolaire"
      | "placesFermeesScolaire"
      | "placesOuvertesApprentissage"
      | "placesFermeesApprentissage"
  ): number => {
    if (data) {
      if (scope && scope.type && scope.value && data[status][scope.type]) {
        if (data[status][scope.type][scope.value])
          return Number.parseFloat(
            (data[status][scope.type][scope.value][indicateur] ?? 0).toFixed(2)
          );
        return 0;
      }
      return getNationalData(status, indicateur);
    }
    return 0;
  };

  const getNationalData = (
    status: "submitted" | "draft" | "all",
    indicateur:
      | "tauxTransformation"
      | "countDemande"
      | "differenceCapaciteScolaire"
      | "differenceCapaciteApprentissage"
      | "placesOuvertesScolaire"
      | "placesFermeesScolaire"
      | "placesOuvertesApprentissage"
      | "placesFermeesApprentissage"
  ): number => {
    if (data) {
      return Number.parseFloat(
        (data[status]["national"][indicateur] ?? 0).toFixed(2)
      );
    }
    return 0;
  };

  const getScopedRatioFermetures = (
    status: "submitted" | "draft" | "all"
  ): number => {
    if (data) {
      if (
        scope &&
        scope.type &&
        scope.value &&
        data[status][scope.type] &&
        data[status][scope.type][scope.value]
      )
        return Number.parseFloat(
          (
            ((getScopedData(status, "placesFermeesScolaire") +
              getScopedData(status, "placesFermeesApprentissage")) /
              (getScopedData(status, "placesFermeesScolaire") +
                getScopedData(status, "placesFermeesApprentissage") +
                getScopedData(status, "placesOuvertesScolaire") +
                getScopedData(status, "placesOuvertesApprentissage"))) *
            100
          ).toFixed(2)
        );
      return getNationalRatioFermetures(status);
    }
    return 0;
  };

  const getNationalRatioFermetures = (
    status: "submitted" | "draft" | "all"
  ): number => {
    if (data)
      return Number.parseFloat(
        (
          ((getNationalData(status, "placesFermeesScolaire") +
            getNationalData(status, "placesFermeesApprentissage")) /
            (getNationalData(status, "placesFermeesScolaire") +
              getNationalData(status, "placesFermeesApprentissage") +
              getNationalData(status, "placesOuvertesScolaire") +
              getNationalData(status, "placesOuvertesApprentissage"))) *
          100
        ).toFixed(2)
      );

    return 0;
  };

  return (
    <>
      {isLoading ? (
        <Loader></Loader>
      ) : (
        <Box>
          <Flex direction={"column"}>
            <Text fontSize={20} fontWeight={700} lineHeight={"31px"}>
              INDICATEURS CLÉS DE LA TRANSFORMATION
            </Text>
            <Grid gap={5} templateColumns={"repeat(3,1fr)"} mt={3}>
              <GridItem colSpan={2}>
                <Flex flexDirection={"column"} h="2xs" gap={5}>
                  <StatCard label="taux de transformation">
                    <Flex justifyContent={"space-between"}>
                      <Flex flexDirection={"column"} gap={2}>
                        <Flex mt={1}>
                          <Img alt="" src="/icons/green_dot.svg" me={2} />
                          <Text>DEMANDES VALIDÉES</Text>
                        </Flex>
                        <Flex mt={2}>
                          <Text
                            fontSize="40px"
                            fontWeight="800"
                            color="bluefrance.113"
                          >
                            {`${getScopedData(
                              "submitted",
                              "tauxTransformation"
                            )} %`}
                          </Text>
                        </Flex>
                        <Flex flexDirection="column" mt={1}>
                          <ProgressBar
                            percentage={
                              (getScopedData(
                                "submitted",
                                "tauxTransformation"
                              ) /
                                6) *
                              100
                            }
                          />
                          <Text>
                            {`
                            ${(
                              (getScopedData(
                                "submitted",
                                "tauxTransformation"
                              ) /
                                6) *
                              100
                            ).toFixed(2)}% de l'objectif`}
                          </Text>
                        </Flex>
                      </Flex>
                      <Flex flexDirection={"column"} gap={2}>
                        <Flex mt={1}>
                          <Img alt="" src="/icons/orange_dot.svg" me={2} />
                          <Text>PROJETS DE DEMANDE</Text>
                        </Flex>
                        <Flex mt={2}>
                          <Text
                            fontSize="40px"
                            fontWeight="800"
                            color="bluefrance.113"
                          >
                            {`${getScopedData(
                              "draft",
                              "tauxTransformation"
                            )} %`}
                          </Text>
                        </Flex>
                        <Flex flexDirection="column" gap={2} mt={1}>
                          <ProgressBar
                            percentage={
                              (getScopedData("draft", "tauxTransformation") /
                                6) *
                              100
                            }
                          />
                          <Text>
                            {`
                            ${(
                              (getScopedData("draft", "tauxTransformation") /
                                6) *
                              100
                            ).toFixed(2)}% de l'objectif`}
                          </Text>
                        </Flex>
                      </Flex>
                    </Flex>
                  </StatCard>
                </Flex>
              </GridItem>
              <GridItem h="100%">
                <Flex flexDirection={"column"} gap={5}>
                  <Flex minH="2xs">
                    {scope && scope.type && scope.value && (
                      <StatCard label="écart vs. moyenne nationale">
                        <Text
                          fontSize="40px"
                          fontWeight="800"
                          color={
                            getScopedData("all", "tauxTransformation") -
                              getNationalData("all", "tauxTransformation") >=
                            0
                              ? "pilotage.green.3"
                              : "orange.warning"
                          }
                        >
                          {`${(
                            getScopedData("all", "tauxTransformation") -
                            getNationalData("all", "tauxTransformation")
                          ).toFixed(2)} pts`}
                        </Text>
                      </StatCard>
                    )}
                  </Flex>
                </Flex>
              </GridItem>
              <GridItem colSpan={2}>
                <SimpleGrid spacing={5} columns={[2]}>
                  <StatCard
                    label="places ouvertes"
                    icon="places_ouvertes"
                    minH="3xs"
                  >
                    <Flex flexDirection={"column"} gap={3}>
                      <Flex>
                        <Text
                          fontSize="40px"
                          fontWeight="800"
                          color="bluefrance.113"
                        >
                          {getScopedData("all", "placesOuvertesScolaire") +
                            getScopedData("all", "placesOuvertesApprentissage")}
                        </Text>
                      </Flex>
                      <ProgressBar
                        percentage={
                          ((getScopedData(
                            "submitted",
                            "placesOuvertesScolaire"
                          ) +
                            getScopedData(
                              "submitted",
                              "placesOuvertesApprentissage"
                            )) /
                            (getScopedData("all", "placesOuvertesScolaire") +
                              getScopedData(
                                "all",
                                "placesOuvertesApprentissage"
                              ))) *
                          100
                        }
                        leftLabel="Validées"
                        rightLabel={
                          getScopedData("submitted", "placesOuvertesScolaire") +
                          getScopedData(
                            "submitted",
                            "placesOuvertesApprentissage"
                          )
                        }
                        colorScheme="green.submitted"
                      />
                      <ProgressBar
                        percentage={
                          ((getScopedData("draft", "placesOuvertesScolaire") +
                            getScopedData(
                              "draft",
                              "placesOuvertesApprentissage"
                            )) /
                            (getScopedData("all", "placesOuvertesScolaire") +
                              getScopedData(
                                "all",
                                "placesOuvertesApprentissage"
                              ))) *
                          100
                        }
                        leftLabel="En projet"
                        rightLabel={
                          getScopedData("draft", "placesOuvertesScolaire") +
                          getScopedData("draft", "placesOuvertesApprentissage")
                        }
                        colorScheme="orange.draft"
                      />
                    </Flex>
                  </StatCard>
                  <StatCard
                    label="places fermées"
                    icon="places_fermees"
                    minH="3xs"
                  >
                    <Flex flexDirection={"column"} gap={3}>
                      <Flex>
                        <Text
                          fontSize="40px"
                          fontWeight="800"
                          color="bluefrance.113"
                        >
                          {getScopedData("all", "placesFermeesScolaire") +
                            getScopedData("all", "placesFermeesApprentissage")}
                        </Text>
                      </Flex>
                      <ProgressBar
                        percentage={
                          ((getScopedData(
                            "submitted",
                            "placesFermeesScolaire"
                          ) +
                            getScopedData(
                              "submitted",
                              "placesFermeesApprentissage"
                            )) /
                            (getScopedData("all", "placesFermeesScolaire") +
                              getScopedData(
                                "all",
                                "placesFermeesApprentissage"
                              ))) *
                          100
                        }
                        leftLabel="Validées"
                        rightLabel={
                          getScopedData("submitted", "placesFermeesScolaire") +
                          getScopedData(
                            "submitted",
                            "placesFermeesApprentissage"
                          )
                        }
                        colorScheme="green.submitted"
                      />
                      <ProgressBar
                        percentage={
                          ((getScopedData("draft", "placesFermeesScolaire") +
                            getScopedData(
                              "draft",
                              "placesFermeesApprentissage"
                            )) /
                            (getScopedData("all", "placesFermeesScolaire") +
                              getScopedData(
                                "all",
                                "placesFermeesApprentissage"
                              ))) *
                          100
                        }
                        leftLabel="En projet"
                        rightLabel={
                          getScopedData("draft", "placesFermeesScolaire") +
                          getScopedData("draft", "placesFermeesApprentissage")
                        }
                        colorScheme="orange.draft"
                      />
                    </Flex>
                  </StatCard>
                </SimpleGrid>
              </GridItem>
              <GridItem>
                <StatCard label="ratio des fermetures" minH="3xs">
                  <Flex flexDirection={"column"}>
                    <Flex
                      fontSize="40px"
                      fontWeight="800"
                      mb={1}
                      color={
                        getScopedRatioFermetures("all") >= 30
                          ? "pilotage.green.3"
                          : "orange.warning"
                      }
                    >
                      {`${getScopedRatioFermetures("all")} %`}
                    </Flex>
                    {scope && scope.type && scope.value && (
                      <>
                        <Divider w="100%" mb={2} />
                        <Delta
                          delta={Number.parseFloat(
                            (
                              getScopedRatioFermetures("all") -
                              getNationalRatioFermetures("all")
                            ).toFixed(2)
                          )}
                        />
                      </>
                    )}
                  </Flex>
                </StatCard>
              </GridItem>
            </Grid>
          </Flex>
        </Box>
      )}
    </>
  );
};