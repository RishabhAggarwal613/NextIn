import React from "react";
import { View, Text } from "react-native";

/**
 * Glass-style card with optional title/subtitle.
 * Tailwind (NativeWind) classes are supported via `className`.
 */
export default function FancyCard({ title, subtitle, children, style }) {
  return (
    <View className="bg-card rounded-xl p-4" style={style}>
      {title ? (
        <Text className="text-text text-lg font-extrabold mb-1">{title}</Text>
      ) : null}
      {subtitle ? <Text className="text-muted mb-2">{subtitle}</Text> : null}
      {children}
    </View>
  );
}
