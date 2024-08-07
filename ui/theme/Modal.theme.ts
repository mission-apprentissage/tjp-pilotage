import { modalAnatomy as parts } from "@chakra-ui/anatomy";
import {
  createMultiStyleConfigHelpers,
  defineStyle,
} from "@chakra-ui/styled-system";

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(parts.keys);

const half = defineStyle({
  width: "50vw",
});

const sizes = {
  half: definePartsStyle({ dialog: half }),
};

export const modalTheme = defineMultiStyleConfig({
  sizes,
});
