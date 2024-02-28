import { defineStyle, defineStyleConfig } from "@chakra-ui/react";

const infoStyle = defineStyle({
  color: "info.text",
  bgColor: "info.950",
});

const errorStyle = defineStyle({
  color: "error.425",
  bgColor: "error.950",
});

const successStyle = defineStyle({
  color: "success.425",
  bgColor: "success.950",
});

const warningStyle = defineStyle({
  color: "warning.425",
  bgColor: "warning.950",
});

const newStyle = defineStyle({
  color: "yellowMoutarde.348",
  bgColor: "yellowMoutarde.950",
});

const purpleGlycineStyle = defineStyle({
  color: "purpleGlycine.319",
  bgColor: "purpleGlycine.950",
});

const pinkTuileStyle = defineStyle({
  color: "pinkTuile.425",
  bgColor: "pinkTuile.950",
});

const brownCafeCremeStyle = defineStyle({
  color: "brownCafeCreme.383",
  bgColor: "brownCafeCreme.950",
});

export const badgeTheme = defineStyleConfig({
  baseStyle: {
    display: "inline-flex",
    flexDirection: "row",
    alignItems: "center",
    width: "fit-content",
    fontWeight: 700,
    borderRadius: "0.25rem",
    textTransform: "uppercase",
    color: "grey.200",
    backgroundColor: "grey.950",
  },
  sizes: {
    sm: {
      fontSize: "0.75rem",
      lineHeight: "1.25rem",
      minHeight: "1.125rem",
      padding: "0 0.375rem",
    },
    md: {
      fontSize: "0.875rem",
      lineHeight: "1.5rem",
      minHeight: "1.5rem",
      padding: "0 0.5rem",
    },
  },
  variants: {
    info: infoStyle,
    error: errorStyle,
    success: successStyle,
    warning: warningStyle,
    new: newStyle,
    purpleGlycine: purpleGlycineStyle,
    pinkTuile: pinkTuileStyle,
    brownCafeCreme: brownCafeCremeStyle,
  },
  defaultProps: {
    size: "md",
    variant: "info",
  },
});
