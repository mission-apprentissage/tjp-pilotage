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

const lavanderStyle = defineStyle({
  color: "bluefrance.113",
  bgColor: "bluefrance.925",
});

const greyStyle = defineStyle({
  color: "grey.425",
  bgColor: "grey.925",
});

const neutralStyle = defineStyle({
  color: "grey.425",
  bgColor: "grey.1000_active",
  borderColor: "grey.425",
  borderWidth: "1px",
  borderStyle: "solid",
});

const draftStyle = defineStyle({
  color: "yellowTournesol.407",
  bgColor: "yellowTournesol.950",
});

const greenArchipelStyle = defineStyle({
  bgColor: "#C7F6FC",
  color: "#006A6F",
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
    xs: {
      padding: "0 6px 0 6px",
      fontSize: "12px",
      lineHeight: "20px",
      height: "fit-content",
      fontWeight: 400,
      textTransform: "none",
      marginTop: "auto",
      marginBottom: "auto",
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
    lavander: lavanderStyle,
    grey: greyStyle,
    neutral: neutralStyle,
    draft: draftStyle,
    greenArchipel: greenArchipelStyle,
  },
  defaultProps: {
    size: "md",
    variant: "info",
  },
});
