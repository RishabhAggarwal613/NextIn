import "react-native-gesture-handler";
import "react-native-reanimated";
import React from "react";
import { useColorScheme } from "react-native";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer, DefaultTheme, DarkTheme } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import UIProvider from "./providers/UIProvider";
import RootNavigator from "./navigation/RootNavigator";

export default function App() {
  const scheme = useColorScheme();
  const navTheme = scheme === "dark" ? { ...DarkTheme } : { ...DefaultTheme };
  // Match our brand background
  navTheme.colors = { ...navTheme.colors, background: "#0F1224" };

  return (
    <UIProvider>
      <SafeAreaProvider>
        <NavigationContainer theme={navTheme}>
          <RootNavigator />
          <StatusBar style="light" />
        </NavigationContainer>
      </SafeAreaProvider>
    </UIProvider>
  );
}
