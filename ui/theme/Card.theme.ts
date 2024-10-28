// eslint-disable-next-line import/no-extraneous-dependencies
import { cardAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(cardAnatomy.keys);

const baseStyle = definePartsStyle({
  container: {
    boxShadow: "none",
    borderRadius: "4px",
    borderStyle: "solid",
    borderWidth: "1px",
    borderColor: "grey.900",
  },
});

export const cardTheme = defineMultiStyleConfig({ baseStyle });
