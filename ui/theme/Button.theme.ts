import { defineStyle, defineStyleConfig } from "@chakra-ui/react";

const commonButtonStyle = {
  borderRadius: 0,
  textTransform: "none",
  fontWeight: 400,
  _focus: { boxShadow: "0px 0px 0px 2px #FFFFFF, 0px 0px 0px 4px #0A76F6" },
  _focusVisible: {
    boxShadow: "0px 0px 0px 2px #FFFFFF, 0px 0px 0px 4px #0A76F6",
  },
};
const primary = defineStyle({
  ...commonButtonStyle,
  bg: "bluefrance.113",
  color: "white",
  _hover: { bg: "bluefrance.113_hover" },
});

export const buttonTheme = defineStyleConfig({
  variants: { primary },
  baseStyle: { borderRadius: 40 },
});
