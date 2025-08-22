import React from "react";
import { View, Text } from "react-native";
import GradientBackground from "../components/layout/GradientBackground";
import BrandButton from "../components/ui/BrandButton";
import { MotiView } from "moti";
import { SCREENS } from "../navigation/types";

export default function RoleSelectScreen({ navigation }) {
  return (
    <GradientBackground>
      <View className="flex-1 px-6 justify-center">
        <MotiView from={{ opacity: 0, translateY: 16 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: "timing", duration: 500 }}>
          <Text className="text-text text-3xl font-extrabold mb-2">NextIn</Text>
          <Text className="text-muted mb-6">Transparent, dignified queues. Choose your role to continue.</Text>
          <BrandButton title="Client (Create Queue)" icon="account-tie" onPress={() => navigation.navigate(SCREENS.CreateQueue)} />
          <BrandButton title="Customer (Join Queue)" icon="account" mode="outlined" onPress={() => navigation.navigate(SCREENS.JoinQueue)} />
        </MotiView>
      </View>
    </GradientBackground>
  );
}
