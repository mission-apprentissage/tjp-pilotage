import { tableAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(tableAnatomy.keys);

const sm = definePartsStyle({
  th: { px: 3, textTransform: "unset", fontSize: "12" },
  td: { px: 3, fontSize: "12" },
});

export const tableTheme = defineMultiStyleConfig({
  sizes: { sm },
});
