// eslint-disable-next-line import/no-extraneous-dependencies
import { formAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(formAnatomy.keys);

const baseStyle = definePartsStyle({
  container: {
    label: {
      fontWeight: "bold",
    },
  },
});

export const formStyle = defineMultiStyleConfig({ baseStyle });
