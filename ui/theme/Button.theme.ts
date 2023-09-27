import { defineStyle, defineStyleConfig } from "@chakra-ui/react";

const commonButtonStyle = {
  borderRadius: 0,
  textTransform: "none",
  fontWeight: 400,
  _focus: {
    outlineColor: "#0A76F6",
  },
  _focusVisible: {
    outlineColor: "#0A76F6",
  },
};

const primary = defineStyle({
  ...commonButtonStyle,
  bg: "bluefrance.113",
  color: "white",
  _hover: {
    bg: "bluefrance.113_hover",
    _disabled: { bg: "bluefrance.113" },
  },
});

const secondary = defineStyle({
  ...commonButtonStyle,
  bg: "white",
  color: "initial",
  borderColor: "bluefrance.113",
  borderWidth: "1px",
  _hover: {
    bg: "gray.100",
    _disabled: { bg: "white" },
  },
});

const createButton = defineStyle({
  ...commonButtonStyle,
  bg: "blue.main",
  color: "white",
  _hover: {
    bg: "bluefrance.525_hover",
    _disabled: { bg: "bluefrance.525" },
  },
  borderRadius: 5,
});

const input = defineStyle({
  ...commonButtonStyle,
  bg: "grey.950",
  color: "inherit",
  borderBottom: "2px solid",
  borderBottomColor: "grey.200",
  borderRadius: "4px 4px 0 0",
  textAlign: "left",
  span: {
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  _active: {
    outlineColor: "#0A76F6",
    svg: { transform: "rotate(180deg)" },
  },
});

export const buttonTheme = defineStyleConfig({
  variants: { primary, input, secondary, createButton },
  baseStyle: {},
});
