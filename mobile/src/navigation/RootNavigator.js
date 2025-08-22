import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SCREENS } from "./types";
import RoleSelectScreen from "../screens/RoleSelectScreen";
import CreateQueueScreen from "../screens/Client/CreateQueueScreen";
import QueueControlScreen from "../screens/Client/QueueControlScreen";
import JoinQueueScreen from "../screens/Customer/JoinQueueScreen";
import StatusScreen from "../screens/Customer/StatusScreen";

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  return (
    <Stack.Navigator initialRouteName={SCREENS.RoleSelect} screenOptions={{ headerShown: false }}>
      <Stack.Screen name={SCREENS.RoleSelect} component={RoleSelectScreen} />
      <Stack.Screen name={SCREENS.CreateQueue} component={CreateQueueScreen} />
      <Stack.Screen name={SCREENS.QueueControl} component={QueueControlScreen} />
      <Stack.Screen name={SCREENS.JoinQueue} component={JoinQueueScreen} />
      <Stack.Screen name={SCREENS.Status} component={StatusScreen} />
    </Stack.Navigator>
  );
}
