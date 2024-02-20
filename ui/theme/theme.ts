import { extendBaseTheme, theme as chakraTheme } from "@chakra-ui/react";

import { breadcrumbTheme } from "@/theme/Breadcrumb.theme";
import { cardTheme } from "@/theme/Card.theme";
import { checkboxTheme } from "@/theme/Checkbox.theme";
import { formStyle } from "@/theme/Label.theme";
import { linkTheme } from "@/theme/Link.theme";
import { radioTheme } from "@/theme/Radio.theme";
import { selectTheme } from "@/theme/Select.theme";
import { sliderTheme } from "@/theme/Slider.theme";
import { tableTheme } from "@/theme/Table.theme";
import { tabsTheme } from "@/theme/Tabs.theme";
import { tagTheme } from "@/theme/Tag.theme";
import { tooltipTheme } from "@/theme/Tooltip.theme";

import { badgeTheme } from "./Badge.theme";
import { buttonTheme } from "./Button.theme";

export const themeDefinition = {
  styles: {
    global: {
      "html, body": {
        fontSize: `14px`,
        fontFamily: "Marianne, Arial",
        background: "white",
      },
      ".react-markdown> *:not(:last-child)": {
        marginBottom: "24px",
      },
    },
  },
  fonts: { heading: "Marianne, Arial", body: "Marianne, Arial" },
  colors: {
    info: {
      525: "#0078f3",
      "525_hover": "#6196ff",
      "525_active": "#85a9ff",
      text: "#0063CB",
      950: "#E8EDFF",
      "950_hover": "#c2d1ff",
      "950_active": "#a9bfff",
    },
    blue: {
      main: "#5770BE",
      faded: "#E2E7F8",
    },
    blueecume: {
      400: "#465F9D",
      "400_hover": "#6f89d1",
      "400_active": "#8b9eda",
      675: "#869ECE",
      "675_hover": "#b8c5e2",
      "675_active": "#ced6ea",
      850: "#bfccfb",
      "850_hover": "#8ba7f8",
      "850_active": "#6b93f6",
      925: "#dee5fd",
      "925_hover": "#b4c5fb",
      "925_active": "#99b3f9",
      950: "#e9edfe",
      "950_hover": "#c5d0fc",
      "950_active": "#adbffc",
      975: "#f4f6fe",
      "975_hover": "#d7dffb",
      "975_active": "#c3cffa",
    },
    bluefrance: {
      113: "#000091",
      "113_hover": "#1212ff",
      "113_active": "#2323ff",
      525: "#6a6af4",
      "525_hover": "#b1b1f9",
      "525_active": "#c6c6fb",
      625: "#8585f6",
      "625_hover": "#b1b1f9",
      "625_active": "#c6c6fb",
      850: "#cacafb",
      "850_hover": "#a1a1f8",
      "850_active": "#8b8bf6",
      925: "#e3e3fd",
      "925_hover": "#c1c1fb",
      "925_active": "#adadf9",
      950: "#ececfe",
      "950_hover": "#cecefc",
      "950_active": "#bbbbfc",
      975: "#f5f5fe",
      "975_hover": "#dcdcfc",
      "975_active": "#cbcbfa",
    },
    redmarianne: {
      472: "#e1000f",
      "472_hover": "#ff292f",
      "472_active": "#ff4347",
      625: "#f95c5e",
      "625_hover": "#fa9293",
      "625_active": "#fbabac",
      925: "#fddede",
      "925_hover": "#fbb6b6",
      "925_active": "#fa9e9e",
    },
    pinkmacaron: {
      689: "#E18B76",
      850: "#FCC0B4",
      925: "#FDDFDA",
      950: "#FEE9E6",
    },
    grey: {
      1000: "#ffffff",
      "1000_hover": "#f6f6f6",
      "1000_active": "#ededed",
      975: "#f6f6f6",
      "975_hover": "#dfdfdf",
      "975_active": "#cfcfcf",
      950: "#eeeeee",
      "950_hover": "#d2d2d2",
      "950_active": "#c1c1c1",
      900: "#dddddd",
      "900_hover": "#bbbbbb",
      "900_active": "#a7a7a7",
      850: "#cecece",
      "850_hover": "#a8a8a8",
      "850_active": "#939393",
      200: "#3a3a3a",
      "200_hover": "#616161",
      "200_active": "#777777",
      425: "#666666",
      "425_hover": "#919191",
      "425_active": "#a6a6a6",
      525: "#7b7b7b",
      "525_hover": "#a6a6a6",
      "525_active": "#bababa",
      625: "#929292",
    },
    warning: {
      525: "#d64d00",
      "525_hover": "#ff754e",
      "525_active": "#ff8e76",
    },
    success: {
      850: "#3bea7e",
      "850_hover": "#2cb862",
      "850_active": "#259e53",
    },
    orange: {
      draft: "#FEEBCA",
      dark: "#716043",
      warning: "#FF6F4C",
    },
    green: {
      submitted: "#C8F6D6",
    },
    pilotage: {
      red: "#FA9293",
      orange: "#FFBBAB",
      yellow: "#FEEBD0",
      green: {
        1: "#C8F6D6",
        2: "#58B77D",
        3: "#4B9F6C",
      },
    },
  },
  components: {
    Button: buttonTheme,
    Tabs: tabsTheme,
    Breadcrumb: breadcrumbTheme,
    Table: tableTheme,
    Tooltip: tooltipTheme,
    Select: selectTheme,
    Card: cardTheme,
    Radio: radioTheme,
    Slider: sliderTheme,
    Link: linkTheme,
    Form: formStyle,
    Tag: tagTheme,
    Checkbox: checkboxTheme,
    Badge: badgeTheme,
  },
};

export const theme = extendBaseTheme(chakraTheme, themeDefinition);
