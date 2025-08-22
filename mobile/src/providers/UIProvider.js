import React from "react";
import {
  Provider as PaperProvider,
  MD3DarkTheme,
  MD3LightTheme,
} from "react-native-paper";
import { useColorScheme } from "react-native";

const brand = "#6C63FF";

const light = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: brand,
    secondary: "#00D4FF",
    background: "#0F1224",
    surface: "rgba(255,255,255,0.06)",
    onPrimary: "white",
  },
};

const dark = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: brand,
    secondary: "#00D4FF",
    background: "#0F1224",
    surface: "rgba(255,255,255,0.06)",
    onPrimary: "white",
  },
};

export default function UIProvider({ children }) {
  const scheme = useColorScheme();
  const theme = scheme === "light" ? light : dark;
  return <PaperProvider theme={theme}>{children}</PaperProvider>;
}
