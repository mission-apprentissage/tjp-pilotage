// eslint-disable-next-line import/no-extraneous-dependencies
import { sliderAnatomy as parts } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";
const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(parts.keys);
const baseStyle = definePartsStyle({
  thumb: {
    bg: "info.525",
    _hover: {
      bg: "info.525_hover",
    },
  },
  filledTrack: {
    bg: "info.525",
  },
});
export const sliderTheme = defineMultiStyleConfig({ baseStyle });
