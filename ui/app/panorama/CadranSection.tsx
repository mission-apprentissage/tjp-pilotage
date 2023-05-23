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
import { useState } from "react";

import { Multiselect } from "../../components/Multiselect";
import { Cadran } from "./Cadran";

export const CadranSection = () => {
  const [sliderValue, setSliderValue] = useState(50);

  const labelStyles = {
    mt: "-8",
    ml: "-2.5",
    fontSize: "sm",
  };

  return (
    <Container as="section" py="12" maxWidth={"container.xl"}>
      <Stack direction={["column", "row"]} spacing="16">
        <Box flex={1}>
          <Heading fontWeight={"hairline"} maxWidth={250} as="h2" ml="6">
            Analyse des formations
          </Heading>
          <FormControl>
            <FormLabel mt="12">
              Sélectionner le curseur du seuil minimal en effectif
            </FormLabel>
            <Slider
              mt="6"
              onChange={(val) => setSliderValue(val)}
              min={1}
              max={1000}
            >
              <SliderMark value={1} {...labelStyles}>
                1
              </SliderMark>
              <SliderMark value={50} {...labelStyles}>
                50
              </SliderMark>
              <SliderMark value={500} {...labelStyles}>
                500
              </SliderMark>
              <SliderMark value={1000} {...labelStyles}>
                1000
              </SliderMark>
              <SliderMark
                value={sliderValue}
                textAlign="center"
                mt="4"
                ml="-5"
                w="12"
                fontSize="sm"
              >
                {sliderValue}
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
              flex={1}
              options={[{ label: "Bac pro", value: "400" }]}
            >
              Niveau
            </Multiselect>
          </HStack>
          <Cadran width={600} height={600} />
        </Box>
      </Stack>
    </Container>
  );
};
