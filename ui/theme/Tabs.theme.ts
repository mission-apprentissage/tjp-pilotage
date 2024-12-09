// eslint-disable-next-line import/no-extraneous-dependencies
import { tabsAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(tabsAnatomy.keys);

const blueBorder = definePartsStyle({
  tablist: {
    borderRadius: "4px",
    borderWidth: 1,
    borderColor: "grey.900",
    width: "fit-content",
  },
  tab: {
    h: "40px",
    w: "fit-content",
    color: "black",
    fontWeight: 700,
    bgColor: "white",
    _hover: {
      borderRadius: "0px",
      bg: "grey.950_hover",
    },
    _selected: {
      color: "bluefrance.113",
      _hover: {
        bg: "grey.1000_hover",
      },
      borderRadius: "4px",
      borderWidth: 1,
      borderColor: "bluefrance.113",
    },
  },
});

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
  variants: { "enclosed-colored": enclosedColored, "blue-border": blueBorder },
});
