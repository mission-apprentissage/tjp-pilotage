import { defineStyle, defineStyleConfig } from "@chakra-ui/react";

const grey = defineStyle({
  bg: "grey.950",
  borderTopLeftRadius: "4px",
  borderTopRightRadius: "4px",
  borderBottomLeftRadius: "0px",
  borderBottomRightRadius: "0px",
  borderBottomWidth: "2px",
  borderBottomColor: "grey.200",
  borderBottomStyle: "solid",
});

export const textareaTheme = defineStyleConfig({
  variants: {
    grey,
  },
});
