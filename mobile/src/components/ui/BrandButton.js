import React from "react";
import { Button } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function BrandButton({ title, icon, mode="contained", onPress, loading }) {
  return (
    <Button
      mode={mode}
      onPress={onPress}
      loading={loading}
      icon={icon ? (p) => <MaterialCommunityIcons name={icon} {...p} /> : undefined}
      style={{ borderRadius: 16, marginVertical: 6 }}
      contentStyle={{ paddingVertical: 10 }}
      labelStyle={{ fontWeight: "700" }}
    >
      {title}
    </Button>
  );
}
