import { defineStyle, defineStyleConfig } from "@chakra-ui/react";

const outline = defineStyle({
  bg: "unset",
  _hover: {
    bg: "gray.100",
    _disabled: { bg: "bluefrance.113" },
  },
});

const info = defineStyle({
  bgColor: "info.950",
  color: "info.text",
});

export const tagTheme = defineStyleConfig({
  variants: { outline, info },
  baseStyle: {},
});
