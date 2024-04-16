import { defineStyle, defineStyleConfig } from "@chakra-ui/react";

const baseStyle = defineStyle({
  borderRadius: "lg",
  bg: "grey.525",
  fontSize: "s",
  px: 2,
  py: 1,
});

const sizes = {
  sm: defineStyle({
    fontSize: "sm",
    py: "1",
    px: "2",
    maxW: "200px",
  }),
  md: defineStyle({
    fontSize: "md",
    py: "2",
    px: "3",
    maxW: "300px",
  }),
  lg: defineStyle({
    py: "2",
    px: "4",
    maxW: "350px",
  }),
};

export const tooltipTheme = defineStyleConfig({
  baseStyle,
  sizes,
  defaultProps: { size: "md" },
});
