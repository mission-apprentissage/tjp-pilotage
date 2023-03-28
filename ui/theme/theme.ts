import { extendBaseTheme } from "@chakra-ui/react";
import chakraTheme from "@chakra-ui/theme";

import { tabsTheme } from "@/theme/Tabs.theme";

import { buttonTheme } from "./Button.theme";

export const theme = extendBaseTheme(chakraTheme, {
  styles: {
    global: {
      "html, body": {
        fontSize: `16px`,
        fontFamily: "Marianne, Arial",
        background: "white",
      },
    },
  },
  fonts: { heading: "Marianne, Arial" },
  colors: {
    bluefrance: {
      113: "#000091",
      "113_hover": "#1212ff",
      "113_active": "#2323ff",
      925: "#e3e3fd",
      "925_hover": "#c1c1fb",
      "925_active": "#adadf9",
    },
    grey: {
      1000: "#ffffff",
      "1000_hover": "#f6f6f6",
      "1000_active": "#ededed",
      900: "#dddddd",
      "900_hover": "#bbbbbb",
      "900_active": "#a7a7a7",
    },
  },
  components: {
    ...chakraTheme.components,
    Button: buttonTheme,
    Tabs: tabsTheme,
  },
});
