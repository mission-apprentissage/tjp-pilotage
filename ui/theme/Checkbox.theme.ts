import { defineStyle, defineStyleConfig } from "@chakra-ui/react";

const commonCheckboxStyle = {
  textTransform: "none",
};
const accessible = defineStyle({
  ...commonCheckboxStyle,
  control: defineStyle({
    borderColor: "grey.525",
    opacity: 1,
    _checked: {
      backgroundColor: "bluefrance.113",
      borderColor: "bluefrance.113",
    },
  }),
});

export const checkboxTheme = defineStyleConfig({
  variants: { accessible },
  baseStyle: {},
});
