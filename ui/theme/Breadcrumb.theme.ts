// eslint-disable-next-line import/no-extraneous-dependencies
import { breadcrumbAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(breadcrumbAnatomy.keys);

const baseStyle = definePartsStyle({
  container: { color: "grey.425" },
  link: {
    fontSize: 12,
  },
  separator: { marginInlineStart: "8px", marginInlineEnd: "8px" },
});

export const breadcrumbTheme = defineMultiStyleConfig({
  baseStyle,
});
