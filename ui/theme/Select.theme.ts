// eslint-disable-next-line import/no-extraneous-dependencies
import { selectAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(selectAnatomy.keys);

const input = definePartsStyle({
  field: {
    borderRadius: "4px 4px 0 0",
    textTransform: "none",
    fontWeight: 400,
    bg: "grey.950",
    color: "inherit",
    borderBottom: "2px solid",
    borderBottomColor: "grey.200",
    textAlign: "left",
    span: {
      overflow: "hidden",
      textOverflow: "ellipsis",
    },
    _focus: {
      outlineColor: "#0A76F6",
    },
    _focusVisible: {
      outlineColor: "#0A76F6",
    },
  },
});

const newInput = definePartsStyle({
  field: {
    bg: "white",
    borderRadius: "6px",
    border: "1px solid",
    borderColor: "grey.950",
    color: "inherit",
    textAlign: "left",
    span: {
      overflow: "hidden",
      textOverflow: "ellipsis",
    },
    _focus: {
      outlineColor: "#0A76F6",
    },
    _focusVisible: {
      outlineColor: "#0A76F6",
    },
    _active: {
      outlineColor: "#0A76F6",
    },
    _selected: {
      borderBottomColor: "info.525",
    },
  },
});

export const selectTheme = defineMultiStyleConfig({
  variants: { input, newInput },
});
