import React from "react";
import { View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function GradientBackground({ children }) {
  return (
    <LinearGradient colors={["#0F1224", "#1e1b4b"]} start={{x:0,y:0}} end={{x:1,y:1}} style={{ flex:1 }}>
      <View style={{ flex:1 }}>{children}</View>
    </LinearGradient>
  );
}
