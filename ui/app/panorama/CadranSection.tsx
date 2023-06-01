import { SmallCloseIcon } from "@chakra-ui/icons";
import {
  Box,
  Center,
  chakra,
  Container,
  createIcon,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Radio,
  RadioGroup,
  SimpleGrid,
  Slider,
  SliderFilledTrack,
  SliderMark,
  SliderThumb,
  SliderTrack,
  Stack,
  Text,
} from "@chakra-ui/react";
import { ReactNode, useMemo, useState } from "react";

import { api } from "../../api.client";
import { Multiselect } from "../../components/Multiselect";
import { Cadran } from "./Cadran";

const labelStyles = {
  mt: "-8",
  fontSize: "sm",
};

type CadranFormations = Awaited<
  ReturnType<ReturnType<typeof api.getRegionStatsForCadran>["call"]>
>["formations"];

const filterFormations = ({
  effectifMin,
  codeNiveauDiplome,
  cadranFormations,
  tendance,
}: {
  effectifMin: number;
  codeNiveauDiplome?: string[];
  cadranFormations?: CadranFormations;
  tendance?: string;
}) =>
  cadranFormations
    ?.filter(
      (item) =>
        item.effectif &&
        item.effectif >= effectifMin &&
        (!codeNiveauDiplome?.length ||
          codeNiveauDiplome.includes(item.codeNiveauDiplome))
    )
    .filter((item) => {
      if (tendance === "insertion_hausse") {
        return (
          item.tauxInsertion12moisPrecedent !== undefined &&
          item.tauxInsertion12mois >= item.tauxInsertion12moisPrecedent
        );
      }
      if (tendance === "insertion_baisse") {
        return (
          item.tauxInsertion12moisPrecedent !== undefined &&
          item.tauxInsertion12mois < item.tauxInsertion12moisPrecedent
        );
      }
      if (tendance === "poursuite_hausse") {
        return (
          item.tauxInsertion12moisPrecedent !== undefined &&
          item.tauxPoursuiteEtudes >= item.tauxInsertion12moisPrecedent
        );
      }
      if (tendance === "poursuite_baisse") {
        return (
          item.tauxInsertion12moisPrecedent !== undefined &&
          item.tauxPoursuiteEtudes < item.tauxInsertion12moisPrecedent
        );
      }
      if (tendance === "effectif_hausse") {
        return (
          item.effectifPrecedent !== undefined &&
          item.effectif !== undefined &&
          item.effectif >= item.effectifPrecedent
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
  diplomeOptions,
  cadranFormations,
  meanPoursuite,
  meanInsertion,
}: {
  diplomeOptions?: { label: string; value: string }[];
  cadranFormations?: CadranFormations;
  meanPoursuite?: number;
  meanInsertion?: number;
}) => {
  const [effectifMin, setEffectifMin] = useState(0);
  const [codeNiveauDiplome, setCodeNiveauDiplome] = useState<string[]>();
  const [tendance, setTendance] = useState<string>();

  const filteredFormations = useMemo(
    () =>
      filterFormations({
        effectifMin,
        codeNiveauDiplome,
        cadranFormations,
        tendance,
      }),
    [effectifMin, codeNiveauDiplome, cadranFormations, tendance]
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
            <FormLabel>
              Sélectionner le curseur du seuil minimal en effectif
            </FormLabel>
            <Slider
              mt="6"
              onChange={setEffectifMin}
              min={0}
              max={1000}
              value={effectifMin}
              step={5}
            >
              <SliderMark value={0} {...labelStyles}>
                0
              </SliderMark>
              <SliderMark value={1000} {...labelStyles} ml="-30px">
                1000
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
                  label="Effectifs en hausse"
                  value="effectif_hausse"
                  icon={<TendanceHausseIcon color="info.525" />}
                />
                <RadioCard
                  label="Effectifs en baisse"
                  value="effectif_baisse"
                  icon={<TendanceBaisseIcon color="info.525" />}
                />
                <RadioCard
                  label="Insertion en hausse"
                  value="insertion_hausse"
                  icon={<TendanceHausseIcon color="info.525" />}
                />
                <RadioCard
                  label="Insertion en baisse"
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
          <HStack spacing={2}>
            <Multiselect
              maxW={250}
              ml="auto"
              onChange={(value) => setCodeNiveauDiplome(value)}
              flex={1}
              options={diplomeOptions}
            >
              Niveau
            </Multiselect>
          </HStack>
          <Text color="grey" textAlign="right" fontSize="xs">
            Selon indicateurs de la DEPP
          </Text>
          {filteredFormations && (
            <Cadran
              meanPoursuite={meanPoursuite}
              meanInsertion={meanInsertion}
              data={filteredFormations}
              width={600}
              height={600}
            />
          )}
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
