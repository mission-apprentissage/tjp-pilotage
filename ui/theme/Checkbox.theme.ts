import { defineStyle, defineStyleConfig } from "@chakra-ui/react";

const commonCheckboxStyle = {
  textTransform: "none",
};

const accessible = defineStyle({
  ...commonCheckboxStyle,
  control: defineStyle({
    borderColor: "grey.525",
    opacity: 1,
  }),
});

export const checkboxTheme = defineStyleConfig({
  variants: { accessible },
  baseStyle: {},
});
