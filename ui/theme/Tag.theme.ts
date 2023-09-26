import { defineStyle, defineStyleConfig } from "@chakra-ui/react";

const outline = defineStyle({
  bg: "unset",
  _hover: {
    bg: "gray.100",
    _disabled: { bg: "bluefrance.113" },
  },
});

export const tagTheme = defineStyleConfig({
  variants: { outline },
  baseStyle: {},
});
