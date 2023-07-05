import { defineStyle, defineStyleConfig } from "@chakra-ui/react";

const base = defineStyle({
  color: "bluefrance.525",
  fontWeight: "bold",
});

export const linkTheme = defineStyleConfig({
  baseStyle: base,
});
