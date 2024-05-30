import { SmallCloseIcon, ViewIcon } from "@chakra-ui/icons";
import {
  AspectRatio,
  Box,
  Button,
  Center,
  chakra,
  Checkbox,
  createIcon,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Popover,
  PopoverCloseButton,
  PopoverContent,
  PopoverTrigger,
  SimpleGrid,
  Skeleton,
  Slider,
  SliderFilledTrack,
  SliderMark,
  SliderThumb,
  SliderTrack,
  Spinner,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import { useSelectedLayoutSegment } from "next/navigation";
import { usePlausible } from "next-plausible";
import { ReactNode, useMemo, useState } from "react";

import { ExportMenuButton } from "@/components/ExportMenuButton";
import { downloadExcel } from "@/utils/downloadExport";

import { GlossaireShortcut } from "../../../../components/GlossaireShortcut";
import { Quadrant } from "../../../../components/Quadrant";
import { TableQuadrant } from "../../../../components/TableQuadrant";
import { TooltipIcon } from "../../../../components/TooltipIcon";
import { downloadCsv } from "../../../../utils/downloadExport";
import { Order, PanoramaFormations } from "../types";
import { FormationTooltipContent } from "./FormationTooltipContent";

const effectifSizes = [
  { max: 50, size: 6 },
  { max: 200, size: 10 },
  { max: 500, size: 14 },
  { max: 1000, size: 18 },
  { max: 1000000, size: 22 },
];

const labelStyles = {
  mt: "-8",
  fontSize: "sm",
};

type Tendances = {
  effectif_hausse: boolean;
  effectif_baisse: boolean;
  insertion_hausse: boolean;
  insertion_baisse: boolean;
  poursuite_hausse: boolean;
  poursuite_baisse: boolean;
  forte_pression: boolean;
  faible_pression: boolean;
};

const filterFormations = ({
  effectifMin,
  quadrantFormations,
  tendances,
}: {
  effectifMin: number;
  quadrantFormations?: PanoramaFormations;
  tendances: Tendances;
}) =>
  quadrantFormations
    ?.filter((item) => {
      return item.effectif && item.effectif >= effectifMin;
    })
    .filter((item) => {
      let mustBeReturned = true;
      if (tendances["insertion_hausse"] === true) {
        mustBeReturned =
          mustBeReturned &&
          item.tauxInsertionPrecedent !== undefined &&
          item.tauxInsertion > item.tauxInsertionPrecedent;
      }
      if (tendances["insertion_baisse"] === true) {
        mustBeReturned =
          mustBeReturned &&
          item.tauxInsertionPrecedent !== undefined &&
          item.tauxInsertion < item.tauxInsertionPrecedent;
      }
      if (tendances["poursuite_hausse"] === true) {
        mustBeReturned =
          mustBeReturned &&
          item.tauxPoursuitePrecedent !== undefined &&
          item.tauxPoursuite > item.tauxPoursuitePrecedent;
      }
      if (tendances["poursuite_baisse"] === true) {
        mustBeReturned =
          mustBeReturned &&
          item.tauxPoursuitePrecedent !== undefined &&
          item.tauxPoursuite < item.tauxPoursuitePrecedent;
      }
      if (tendances["effectif_hausse"] === true) {
        mustBeReturned =
          mustBeReturned &&
          item.effectifPrecedent !== undefined &&
          item.effectif !== undefined &&
          item.effectif > item.effectifPrecedent;
      }
      if (tendances["effectif_baisse"] === true) {
        mustBeReturned =
          mustBeReturned &&
          item.effectifPrecedent !== undefined &&
          item.effectif !== undefined &&
          item.effectif < item.effectifPrecedent;
      }
      if (tendances["forte_pression"] === true) {
        mustBeReturned =
          mustBeReturned &&
          item.tauxPression !== undefined &&
          item.tauxPression >= 1.3;
      }
      if (tendances["faible_pression"] === true) {
        mustBeReturned =
          mustBeReturned &&
          item.tauxPression !== undefined &&
          item.tauxPression < 0.7;
      }
      return mustBeReturned;
    });

const Loader = () => (
  <Center height="100%" width="100%">
    <Spinner size="xl" />
  </Center>
);

export const QuadrantSection = ({
  quadrantFormations,
  isLoading,
  meanPoursuite,
  meanInsertion,
  order,
  handleOrder,
}: {
  quadrantFormations?: PanoramaFormations;
  isLoading: boolean;
  meanPoursuite?: number;
  meanInsertion?: number;
  order?: Partial<Order>;
  handleOrder: (column: Order["orderBy"]) => void;
}) => {
  const segment = useSelectedLayoutSegment();
  const trackEvent = usePlausible();

  const [effectifMin, setEffectifMin] = useState(0);
  const tendancesDefaultValue = {
    effectif_hausse: false,
    effectif_baisse: false,
    insertion_hausse: false,
    insertion_baisse: false,
    poursuite_hausse: false,
    poursuite_baisse: false,
    forte_pression: false,
    faible_pression: false,
  };

  const [tendances, setTendances] = useState<Tendances>(tendancesDefaultValue);
  const [typeVue, setTypeVue] = useState<"quadrant" | "tableau">("quadrant");

  const [currentFormationId, setCurrentFormationId] = useState<
    string | undefined
  >();

  const toggleTypeVue = () => {
    if (typeVue === "quadrant") setTypeVue("tableau");
    else setTypeVue("quadrant");
  };
  const filteredFormations = useMemo(
    () =>
      filterFormations({
        effectifMin,
        quadrantFormations,
        tendances,
      }),
    [effectifMin, quadrantFormations, tendances]
  );

  const handleOppositesTendances = (value: boolean, name: keyof Tendances) => {
    const tendancesTmp = tendances;
    tendancesTmp[name] = value;
    switch (name) {
      case "insertion_hausse":
        tendancesTmp["insertion_baisse"] = false;
        break;
      case "insertion_baisse":
        tendancesTmp["insertion_hausse"] = false;
        break;
      case "poursuite_hausse":
        tendancesTmp["poursuite_baisse"] = false;
        break;
      case "poursuite_baisse":
        tendancesTmp["poursuite_hausse"] = false;
        break;
      case "effectif_hausse":
        tendancesTmp["effectif_baisse"] = false;
        break;
      case "effectif_baisse":
        tendancesTmp["effectif_hausse"] = false;
        break;
      case "forte_pression":
        tendancesTmp["faible_pression"] = false;
        break;
      case "faible_pression":
        tendancesTmp["forte_pression"] = false;
        break;
    }
    setTendances({ ...tendances, ...tendancesTmp });
  };

  const handleCheckboxCardChange = (
    value: boolean,
    name: keyof Tendances | "none"
  ) => {
    if (name === "none") setTendances(tendancesDefaultValue);
    else handleOppositesTendances(value, name);
  };

  return (
    <Box as="section" py="6" mt="6" maxWidth={"container.xl"}>
      <Stack direction={["column", "row"]} spacing="10">
        <Flex direction={"column"} alignContent={"flex-start"}>
          <Heading
            fontWeight={"hairline"}
            maxWidth={250}
            as="h2"
            ml={[null, null, "6"]}
            mb={12}
          >
            Analyse des formations
          </Heading>
          <FormControl>
            <FormLabel>Effectif minimum (en entrée)</FormLabel>
            <Slider
              mt="6"
              onChange={setEffectifMin}
              min={0}
              max={500}
              value={effectifMin}
              step={5}
            >
              <SliderMark value={0} {...labelStyles}>
                0
              </SliderMark>
              <SliderMark value={500} {...labelStyles} ml="-30px">
                500
              </SliderMark>
              <SliderMark
                value={effectifMin}
                textAlign="center"
                mt="4"
                ml="-5"
                w="12"
                fontSize="sm"
              >
                {effectifMin}
              </SliderMark>
              <SliderTrack>
                <SliderFilledTrack />
              </SliderTrack>
              <SliderThumb />
            </Slider>
            <SimpleGrid mt="12" columns={2} gap={4}>
              <CheckboxCard
                label="Effectif en hausse"
                name="effectif_hausse"
                value={tendances["effectif_hausse"]}
                changeHandle={handleCheckboxCardChange}
                icon={<TendanceHausseIcon color="info.525" />}
              />
              <CheckboxCard
                label="Effectif en baisse"
                name="effectif_baisse"
                value={tendances["effectif_baisse"]}
                changeHandle={handleCheckboxCardChange}
                icon={<TendanceBaisseIcon color="info.525" />}
              />
              <CheckboxCard
                label="Tx d'emploi à 6 mois en hausse"
                name="insertion_hausse"
                value={tendances["insertion_hausse"]}
                changeHandle={handleCheckboxCardChange}
                icon={<TendanceHausseIcon color="info.525" />}
              />
              <CheckboxCard
                label="Tx d'emploi à 6 mois en baisse"
                name="insertion_baisse"
                value={tendances["insertion_baisse"]}
                changeHandle={handleCheckboxCardChange}
                icon={<TendanceBaisseIcon color="info.525" />}
              />
              <CheckboxCard
                label="Poursuite d’étude en hausse"
                name="poursuite_hausse"
                value={tendances["poursuite_hausse"]}
                changeHandle={handleCheckboxCardChange}
                icon={<TendanceHausseIcon color="info.525" />}
              />
              <CheckboxCard
                label="Poursuite d’étude en baisse"
                name="poursuite_baisse"
                value={tendances["poursuite_baisse"]}
                changeHandle={handleCheckboxCardChange}
                icon={<TendanceBaisseIcon color="info.525" />}
              />
              <CheckboxCard
                label="Fort taux de pression"
                name="forte_pression"
                value={tendances["forte_pression"]}
                changeHandle={handleCheckboxCardChange}
                icon={<TendanceHausseIcon color="info.525" />}
                tooltip={
                  <TooltipIcon
                    ml="1"
                    label="Formations pour lesquelles le taux de pression est supérieur ou égal à 1.3"
                  />
                }
              />
              <CheckboxCard
                label="Faible taux de pression"
                name="faible_pression"
                value={tendances["faible_pression"]}
                changeHandle={handleCheckboxCardChange}
                icon={<TendanceBaisseIcon color="info.525" />}
                tooltip={
                  <TooltipIcon
                    ml="1"
                    label="Formations pour lesquelles le taux de pression est inférieur à 0.7"
                  />
                }
              />
            </SimpleGrid>
            <CheckboxCard
              mt="4"
              label="Remise à niveau des filtres"
              value={Object.values(tendances).every((value) => value === false)}
              name="none"
              changeHandle={handleCheckboxCardChange}
              icon={<SmallCloseIcon></SmallCloseIcon>}
            />
          </FormControl>
          <GlossaireShortcut label="Voir les définitions" mt={12} />
        </Flex>
        <Box flex={1}>
          <Flex justify="space-between" flexDir={["column", null, "row"]}>
            <Flex gap={2}>
              <Button onClick={() => toggleTypeVue()} variant="solid">
                <ViewIcon mr={2}></ViewIcon>
                {`Passer en vue ${
                  typeVue === "quadrant" ? "tableau" : "quadrant"
                }`}
              </Button>
              <ExportMenuButton
                onExportCsv={async () => {
                  if (!filteredFormations) return;
                  trackEvent(`panorama-${segment}:export`);
                  downloadCsv(
                    `formations_panorama_${segment}`,
                    filteredFormations.map((formation) => ({
                      ...formation,
                    })),
                    {
                      libelleFormation: "Formation",
                      cfd: "CFD",
                      libelleDispositif: "Dispositif",
                      tauxInsertion: "Taux d'emploi",
                      tauxPoursuite: "Taux de poursuite",
                      tauxPression: "Taux de pression",
                      positionQuadrant: "Position dans le quadrant",
                    }
                  );
                }}
                onExportExcel={async () => {
                  if (!filteredFormations) return;
                  trackEvent(`panorama-${segment}:export-excel`);
                  downloadExcel(
                    `formations_panorama_${segment}`,
                    filteredFormations.map((formation) => ({
                      ...formation,
                    })),
                    {
                      libelleFormation: "Formation",
                      cfd: "CFD",
                      libelleDispositif: "Dispositif",
                      tauxInsertion: "Taux d'emploi",
                      tauxPoursuite: "Taux de poursuite",
                      tauxPression: "Taux de pression",
                      positionQuadrant: "Position dans le quadrant",
                    }
                  );
                }}
                variant="solid"
              />
            </Flex>

            <Flex direction={"column"} gap={2}>
              <Flex alignItems={"flex-end"} justify="flex-end" gap={2}>
                <Text color="grey" fontSize="sm" textAlign="left">
                  {filteredFormations?.length ?? "-"} certifications
                </Text>
                -
                <Text color="grey" fontSize="sm" textAlign="right">
                  {filteredFormations?.reduce(
                    (acc, { effectif }) => acc + (effectif ?? 0),
                    0
                  ) ?? "-"}{" "}
                  élèves
                </Text>
              </Flex>
              <Flex alignItems={"flex-end"} justify={"flex-end"}>
                <Popover>
                  <PopoverTrigger>
                    <Flex cursor="pointer">
                      <Icon
                        icon="ri:eye-line"
                        color="grey.425"
                        width={"14px"}
                      />
                      <Text
                        ms={2}
                        color="grey.425"
                        textDecoration={"underline"}
                        lineHeight={"14px"}
                      >
                        Légende
                      </Text>
                    </Flex>
                  </PopoverTrigger>
                  <PopoverContent _focusVisible={{ outline: "none" }} p="3">
                    <>
                      <PopoverCloseButton />
                      <InfoTooltipContent />
                    </>
                  </PopoverContent>
                </Popover>
              </Flex>
            </Flex>
          </Flex>
          <AspectRatio ratio={1} mt={2}>
            <>
              {isLoading ? (
                <Loader />
              ) : filteredFormations &&
                filteredFormations.length &&
                meanInsertion &&
                meanPoursuite ? (
                typeVue === "quadrant" ? (
                  <Quadrant
                    onClick={({ cfd, codeDispositif }) =>
                      setCurrentFormationId(`${cfd}_${codeDispositif}`)
                    }
                    meanInsertion={meanInsertion}
                    meanPoursuite={meanPoursuite}
                    currentFormationId={currentFormationId}
                    data={filteredFormations.map((formation) => ({
                      ...formation,
                      codeDispositif: formation.codeDispositif ?? "",
                    }))}
                    TooltipContent={FormationTooltipContent}
                    effectifSizes={effectifSizes}
                  />
                ) : (
                  <TableQuadrant
                    formations={filteredFormations}
                    handleClick={setCurrentFormationId}
                    currentFormationId={currentFormationId}
                    order={order}
                    handleOrder={(column?: string) =>
                      handleOrder(column as Order["orderBy"])
                    }
                  />
                )
              ) : (
                <Flex>
                  <Text>
                    Aucune donnée à afficher pour les filtres sélectionnés
                  </Text>
                </Flex>
              )}
              {!filteredFormations && <Skeleton opacity="0.3" height="100%" />}
            </>
          </AspectRatio>
          <Text color="grey" mt="4" fontSize="xs">
            Données Inser Jeunes produites par la DEPP, les formations
            inférieures à 20 sortants sur deux ans, ne sont pas représentées
            dans ce quadrant pour des raisons statistiques
          </Text>
        </Box>
      </Stack>
    </Box>
  );
};

const CheckboxCard = chakra(
  ({
    label,
    name,
    value,
    icon,
    changeHandle,
    className,
    tooltip,
  }: {
    label: string;
    name: keyof Tendances | "none";
    value: boolean;
    icon: ReactNode;
    changeHandle: (value: boolean, name: keyof Tendances | "none") => void;
    className?: string;
    tooltip?: ReactNode;
  }) => (
    <Flex className={className} border="1px solid" borderColor="grey.900">
      <Checkbox
        flex={1}
        p="4"
        name={name}
        isChecked={value}
        onChange={(e) => changeHandle(e.target.checked, name)}
      >
        {label}
        {tooltip}
      </Checkbox>
      <Center bg="grey.950" p="4">
        {icon}
      </Center>
    </Flex>
  )
);

const TendanceHausseIcon = createIcon({
  displayName: "TendanceHausseIcon",
  viewBox: "0 0 32 31",
  path: (
    <path
      d="M3.17022 24.5342L9.36106 18.5063L13.8403 22.8661L21.0777 15.8207L23.9166 18.5834V10.875H16L18.8389 13.6392L13.8403 18.5063L9.36264 14.1449L1.53147 21.77C0.628859 19.7967 0.163795 17.6602 0.166639 15.5C0.166639 6.98542 7.25522 0.083374 16 0.083374C24.7447 0.083374 31.8333 6.98542 31.8333 15.5C31.8333 24.0147 24.7447 30.9167 16 30.9167C13.4951 30.9183 11.0257 30.3405 8.79519 29.2308C6.56462 28.1212 4.63671 26.5114 3.17022 24.5342Z"
      fill="currentColor"
    />
  ),
});

const TendanceBaisseIcon = createIcon({
  displayName: "TendanceHausseIcon",
  viewBox: "0 0 32 32",
  path: (
    <path
      d="M3.17022 6.72171L9.36105 12.9125L13.8403 8.43487L21.0777 15.6707L23.9166 12.8334L23.9166 20.75L16 20.75L18.8389 17.9111L13.8403 12.9125L9.36264 17.3918L1.53147 9.56062C0.628857 11.5873 0.163794 13.7815 0.166638 16C0.166638 24.7448 7.25522 31.8334 16 31.8334C24.7447 31.8334 31.8333 24.7448 31.8333 16C31.8333 7.25529 24.7447 0.166704 16 0.166705C13.4951 0.165067 11.0257 0.758508 8.79518 1.89815C6.56462 3.03779 4.6367 4.69103 3.17022 6.72171Z"
      fill="currentColor"
    />
  ),
});

const InfoTooltipContent = () => (
  <>
    <Text mt="4" mb="2" fontSize="sm" fontWeight="bold">
      Légende:
    </Text>
    <VStack align="flex-start" spacing={2}>
      {effectifSizes.map(({ max, size }, i) => (
        <Flex key={max} align="center">
          <Box
            borderRadius={100}
            width={`${size}px`}
            height={`${size}px`}
            mx={`${22 - size / 2}`}
            border="1px solid black"
          />
          <Text flex={1} ml="4" fontSize="sm">
            {max !== 1000000 && (
              <>
                Effectif {"<"} {max}
              </>
            )}
            {max === 1000000 && (
              <>
                Effectif {">"} {effectifSizes[i - 1].max}
              </>
            )}
          </Text>
        </Flex>
      ))}
    </VStack>
  </>
);
