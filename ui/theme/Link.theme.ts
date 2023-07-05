import { defineStyle, defineStyleConfig } from "@chakra-ui/react";

const text = defineStyle({
  color: "bluefrance.525",
  fontWeight: "bold",
});

export const linkTheme = defineStyleConfig({
  variants: { text },
});
