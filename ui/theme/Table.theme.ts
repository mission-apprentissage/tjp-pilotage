// eslint-disable-next-line import/no-extraneous-dependencies
import { tableAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(tableAnatomy.keys);

const sm = definePartsStyle({
  th: { px: 4, textTransform: "unset", fontSize: "12" },
  td: { px: 4, fontSize: "12" },
});

export const tableTheme = defineMultiStyleConfig({
  sizes: { sm },
});
