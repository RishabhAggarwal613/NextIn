import "react-native-gesture-handler";
import "react-native-reanimated";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import UIProvider from "./providers/UIProvider";
import RootNavigator from "./navigation/RootNavigator";

export default function App() {
  return (
    <UIProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </UIProvider>
  );
}
