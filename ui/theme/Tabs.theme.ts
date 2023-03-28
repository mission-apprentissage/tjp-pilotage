import { tabsAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(tabsAnatomy.keys);

const enclosedColored = definePartsStyle({
  tab: {
    bg: "bluefrance.925",
    color: "bluefrance.113",
    mr: 2,
    fontWeight: 700,
    marginInlineEnd: "2 !important",
    borderTopWidth: 2,
    _hover: {
      bg: "bluefrance.925_hover",
    },
    _selected: {
      color: "bluefrance.113",
      bg: "grey.1000",
      _hover: {
        bg: "grey.1000_hover",
      },
    },
  },
});

export const tabsTheme = defineMultiStyleConfig({
  variants: { "enclosed-colored": enclosedColored },
});
