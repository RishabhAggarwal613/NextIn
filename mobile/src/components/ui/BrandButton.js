import React from "react";
import { Button } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";

/**
 * Brand-styled button (Paper MD3).
 * Props: title, icon (MC icon name), mode ("contained" | "outlined" | "text"), onPress, loading, disabled, style, contentStyle
 */
export default function BrandButton({
  title,
  icon,
  mode = "contained",
  onPress,
  loading,
  disabled,
  style,
  contentStyle,
  ...rest
}) {
  return (
    <Button
      mode={mode}
      onPress={onPress}
      loading={loading}
      disabled={disabled || loading}
      icon={
        icon ? (props) => <MaterialCommunityIcons name={icon} {...props} /> : undefined
      }
      style={[{ borderRadius: 16, marginVertical: 6 }, style]}
      contentStyle={[{ paddingVertical: 12 }, contentStyle]}
      labelStyle={{ fontWeight: "700" }}
      accessibilityRole="button"
      accessibilityLabel={title}
      {...rest}
    >
      {title}
    </Button>
  );
}
