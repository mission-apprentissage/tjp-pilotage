import { defineStyle, defineStyleConfig } from "@chakra-ui/react";

const baseStyle = defineStyle({
  borderRadius: "lg",
  bg: "grey.525",
  fontSize: "xs",
  px: 3,
});

export const tooltipTheme = defineStyleConfig({ baseStyle });
