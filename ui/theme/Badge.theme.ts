import { defineStyle, defineStyleConfig } from "@chakra-ui/react";

const infoStyle = defineStyle({
  color: "info.text",
  bgColor: "info.950",
});

const errorStyle = defineStyle({
  color: "#ce0500",
  bgColor: "#ffe9e9",
});

const successStyle = defineStyle({
  color: "#18753c",
  bgColor: "#b8fec9",
});

const warningStyle = defineStyle({
  color: "#b34000",
  bgColor: "#ffe9e6",
});

const newStyle = defineStyle({
  color: "#695240",
  bgColor: "#feebd0",
});

const purpleGlycineStyle = defineStyle({
  color: "#6e445a",
  bgColor: "#fee7fc",
});

const pinkTuileStyle = defineStyle({
  color: "#a94645",
  bgColor: "#fee9e7",
});

const brownCafeCremeStyle = defineStyle({
  color: "#685c48",
  bgColor: "#f7ecdb",
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
    color: "grey.850",
    backgroundColor: "#242424", // grey.950
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
