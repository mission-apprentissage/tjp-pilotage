// eslint-disable-next-line import/no-extraneous-dependencies
import { radioAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(radioAnatomy.keys);

const baseStyle = definePartsStyle({
  control: {
    _checked: {
      bg: "info.525",
      borderColor: "info.525",
      _hover: { bg: "info.525_hover", borderColor: "info.525_hover" },
    },
  },
});

export const radioTheme = defineMultiStyleConfig({ baseStyle });
