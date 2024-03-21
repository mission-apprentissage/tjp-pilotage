import { tabsAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(tabsAnatomy.keys);

const enclosedColored = definePartsStyle({
  tab: {
    bg: "bluefrance.925",
    mr: 2,
    fontWeight: 700,
    marginInlineEnd: "2 !important",
    borderTopWidth: 2,
    borderRadius: "4px 4px 0px 0px",
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
