import { Badge, Stack } from "@chakra-ui/react";

import { getTauxPressionStyle } from "@/utils/getBgScale";
export const TauxPressionScale = () => (
  <>
    <Stack my="2">
      <Badge style={getTauxPressionStyle(0.2)}>Entre 0 et 0.5</Badge>
      <Badge style={getTauxPressionStyle(0.6)}>Entre 0.5 et 0.7</Badge>
      <Badge style={getTauxPressionStyle(1)}>Entre 0.7 et 1.3</Badge>
      <Badge style={getTauxPressionStyle(1.4)}>Entre 1.3 et 1.6</Badge>
      <Badge style={getTauxPressionStyle(2)}>Au dessus de 1.6</Badge>
    </Stack>
  </>
);