import {
  Box,
  Container,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Slider,
  SliderFilledTrack,
  SliderMark,
  SliderThumb,
  SliderTrack,
  Stack,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { api } from "../../api.client";
import { Multiselect } from "../../components/Multiselect";
import { Cadran } from "./Cadran";

const labelStyles = {
  mt: "-8",
  ml: "-2.5",
  fontSize: "sm",
};

export const CadranSection = ({
  codeRegion,
  diplomeOptions,
}: {
  codeRegion: string;
  diplomeOptions?: { label: string; value: string }[];
}) => {
  const [effectifMin, setEffectifMin] = useState(0);
  const [codeNiveauDiplome, setCodeNiveauDiplome] = useState<string[]>();

  const { data } = useQuery(
    ["formationForCadran", { effectifMin, codeRegion, codeNiveauDiplome }],
    async () => {
      return api
        .getFormationsForCadran({
          query: {
            codeRegion: [codeRegion],
            effectifMin,
            codeDiplome: codeNiveauDiplome,
          },
        })
        .call();
    },
    { keepPreviousData: true, staleTime: 10000000 }
  );

  return (
    <Container as="section" py="12" mt="8" maxWidth={"container.xl"}>
      <Stack direction={["column", "row"]} spacing="16">
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
              <SliderMark value={500} {...labelStyles}>
                500
              </SliderMark>
              <SliderMark value={1000} {...labelStyles}>
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
          </FormControl>
        </Box>
        <Box flex={1}>
          <HStack spacing={2}>
            <Multiselect
              flex={1}
              options={[{ label: "Bac pro", value: "400" }]}
            >
              Filière
            </Multiselect>
            <Multiselect
              onChange={(value) => setCodeNiveauDiplome(value)}
              flex={1}
              options={diplomeOptions}
            >
              Niveau
            </Multiselect>
          </HStack>
          {data && <Cadran data={data?.formations} width={600} height={600} />}
        </Box>
      </Stack>
    </Container>
  );
};
