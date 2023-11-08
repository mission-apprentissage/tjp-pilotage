import { SmallCloseIcon, ViewIcon } from "@chakra-ui/icons";
import {
  AspectRatio,
  Box,
  Button,
  Center,
  chakra,
  Container,
  createIcon,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Radio,
  RadioGroup,
  SimpleGrid,
  Skeleton,
  Slider,
  SliderFilledTrack,
  SliderMark,
  SliderThumb,
  SliderTrack,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { ReactNode, useMemo, useState } from "react";

import { Cadran } from "../../../../../components/Cadran";
import { TableCadran } from "../../../../../components/TableCadran";
import { FormationTooltipContent } from "./FormationTooltipContent";
import { PanoramaFormations } from "./type";

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

const filterFormations = ({
  effectifMin,
  codeNiveauDiplome,
  libelleFiliere,
  cadranFormations,
  tendance,
}: {
  effectifMin: number;
  codeNiveauDiplome?: string[];
  libelleFiliere?: string[];
  cadranFormations?: PanoramaFormations;
  tendance?: string;
}) =>
  cadranFormations
    ?.filter((item) => {
      if (
        libelleFiliere?.length &&
        (!item.libelleFiliere || !libelleFiliere.includes(item.libelleFiliere))
      )
        return false;
      if (
        codeNiveauDiplome?.length &&
        !codeNiveauDiplome.includes(item.codeNiveauDiplome)
      )
        return false;
      return item.effectif && item.effectif >= effectifMin;
    })
    .filter((item) => {
      if (tendance === "insertion_hausse") {
        return (
          item.tauxInsertion6moisPrecedent !== undefined &&
          item.tauxInsertion6mois > item.tauxInsertion6moisPrecedent
        );
      }
      if (tendance === "insertion_baisse") {
        return (
          item.tauxInsertion6moisPrecedent !== undefined &&
          item.tauxInsertion6mois < item.tauxInsertion6moisPrecedent
        );
      }
      if (tendance === "poursuite_hausse") {
        return (
          item.tauxPoursuiteEtudesPrecedent !== undefined &&
          item.tauxPoursuiteEtudes > item.tauxPoursuiteEtudesPrecedent
        );
      }
      if (tendance === "poursuite_baisse") {
        return (
          item.tauxPoursuiteEtudesPrecedent !== undefined &&
          item.tauxPoursuiteEtudes < item.tauxPoursuiteEtudesPrecedent
        );
      }
      if (tendance === "effectif_hausse") {
        return (
          item.effectifPrecedent !== undefined &&
          item.effectif !== undefined &&
          item.effectif > item.effectifPrecedent
        );
      }
      if (tendance === "effectif_baisse") {
        return (
          item.effectifPrecedent !== undefined &&
          item.effectif !== undefined &&
          item.effectif < item.effectifPrecedent
        );
      }
      if (tendance === "forte_pression") {
        return item.tauxPression !== undefined && item.tauxPression >= 130;
      }
      if (tendance === "faible_pression") {
        return item.tauxPression !== undefined && item.tauxPression < 70;
      }
      return true;
    });

export const CadranSection = ({
  cadranFormations,
  meanPoursuite,
  meanInsertion,
  codeNiveauDiplome,
  libelleFiliere,
}: {
  cadranFormations?: PanoramaFormations;
  meanPoursuite?: number;
  meanInsertion?: number;
  codeNiveauDiplome?: string[];
  libelleFiliere?: string[];
}) => {
  const [effectifMin, setEffectifMin] = useState(0);
  const [tendance, setTendance] = useState<string>();
  const [typeVue, setTypeVue] = useState<"cadran" | "tableau">("cadran");

  const toggleTypeVue = () => {
    if (typeVue === "cadran") setTypeVue("tableau");
    else setTypeVue("cadran");
  };

  const filteredFormations = useMemo(
    () =>
      filterFormations({
        effectifMin,
        codeNiveauDiplome,
        cadranFormations,
        tendance,
        libelleFiliere,
      }),
    [effectifMin, codeNiveauDiplome, cadranFormations, tendance, libelleFiliere]
  );

  return (
    <Container as="section" py="6" mt="6" maxWidth={"container.xl"}>
      <Stack direction={["column", "row"]} spacing="10">
        <Box flex={1}>
          <Heading
            fontWeight={"hairline"}
            maxWidth={250}
            as="h2"
            ml="6"
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

            <RadioGroup
              onChange={setTendance}
              defaultValue={"undefined"}
              defaultChecked
            >
              <SimpleGrid mt="12" columns={2} gap={4}>
                <RadioCard
                  label="Effectif en hausse"
                  value="effectif_hausse"
                  icon={<TendanceHausseIcon color="info.525" />}
                />
                <RadioCard
                  label="Effectif en baisse"
                  value="effectif_baisse"
                  icon={<TendanceBaisseIcon color="info.525" />}
                />
                <RadioCard
                  label="Tx d'emploi à 6 mois en hausse"
                  value="insertion_hausse"
                  icon={<TendanceHausseIcon color="info.525" />}
                />
                <RadioCard
                  label="Tx d'emploi à 6 mois en baisse"
                  value="insertion_baisse"
                  icon={<TendanceBaisseIcon color="info.525" />}
                />
                <RadioCard
                  label="Poursuite d’étude en hausse"
                  value="poursuite_hausse"
                  icon={<TendanceHausseIcon color="info.525" />}
                />
                <RadioCard
                  label="Poursuite d’étude en baisse"
                  value="poursuite_baisse"
                  icon={<TendanceBaisseIcon color="info.525" />}
                />
                <RadioCard
                  label="Fort taux de pression"
                  value="forte_pression"
                  icon={<TendanceHausseIcon color="info.525" />}
                />
                <RadioCard
                  label="Faible taux de pression"
                  value="faible_pression"
                  icon={<TendanceBaisseIcon color="info.525" />}
                />
              </SimpleGrid>
              <RadioCard
                mt="4"
                label="Remise à niveau des filtres"
                value={"undefined"}
                icon={<SmallCloseIcon></SmallCloseIcon>}
              />
            </RadioGroup>
          </FormControl>
        </Box>
        <Box flex={1}>
          <Flex justify="space-between">
            <Flex>
              <Button onClick={() => toggleTypeVue()} variant="solid">
                <ViewIcon mr={2}></ViewIcon>
                {`Passer en vue ${typeVue === "cadran" ? "tableau" : "cadran"}`}
              </Button>
            </Flex>
            <Flex alignItems={"flex-end"}>
              <Text color="grey" fontSize="sm" textAlign="left">
                {filteredFormations?.length ?? "-"} certifications
              </Text>
              <Text ml="2" color="grey" fontSize="sm" textAlign="right">
                {filteredFormations?.reduce(
                  (acc, { effectif }) => acc + (effectif ?? 0),
                  0
                ) ?? "-"}{" "}
                élèves
              </Text>
            </Flex>
          </Flex>
          <AspectRatio ratio={1} mt={2}>
            <>
              {filteredFormations &&
                (typeVue === "cadran" ? (
                  <Cadran
                    meanPoursuite={meanPoursuite}
                    meanInsertion={meanInsertion}
                    data={filteredFormations.map((formation) => ({
                      ...formation,
                      tauxInsertion: formation.tauxInsertion6mois,
                      tauxPoursuite: formation.tauxPoursuiteEtudes,
                    }))}
                    TooltipContent={FormationTooltipContent}
                    itemId={(item) =>
                      item.codeFormationDiplome + item.dispositifId
                    }
                    InfoTootipContent={InfoTooltipContent}
                    effectifSizes={effectifSizes}
                  />
                ) : (
                  <TableCadran
                    formations={filteredFormations.map((formation) => ({
                      ...formation,
                      tauxInsertion: formation.tauxInsertion6mois,
                      tauxPoursuite: formation.tauxPoursuiteEtudes,
                    }))}
                  />
                ))}
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
    </Container>
  );
};

const RadioCard = chakra(
  ({
    label,
    value,
    icon,
    className,
  }: {
    label: string;
    value?: string;
    icon: ReactNode;
    className?: string;
  }) => (
    <Flex className={className} border="1px solid" borderColor="grey.900">
      <Radio flex={1} p="4" value={value}>
        {label}
      </Radio>
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
            mx={22 - size / 2}
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
