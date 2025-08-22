// mobile/src/navigation/index.js
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Screens
import LoginScreen from "../screens/Auth/LoginScreen";
import RegisterScreen from "../screens/Auth/RegisterScreen";
import RoleSelectScreen from "../screens/RoleSelectScreen";
import CreateQueueScreen from "../screens/Client/CreateQueueScreen";
import QueueControlScreen from "../screens/Client/QueueControlScreen";
import JoinQueueScreen from "../screens/Customer/JoinQueueScreen";
import StatusScreen from "../screens/Customer/StatusScreen";

const Stack = createNativeStackNavigator();

export default function RootNav() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{ headerShown: false }}
      >
        {/* Auth */}
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />

        {/* Role selection */}
        <Stack.Screen name="RoleSelect" component={RoleSelectScreen} />

        {/* Client flow */}
        <Stack.Screen name="CreateQueue" component={CreateQueueScreen} />
        <Stack.Screen name="QueueControl" component={QueueControlScreen} />

        {/* Customer flow */}
        <Stack.Screen name="JoinQueue" component={JoinQueueScreen} />
        <Stack.Screen name="Status" component={StatusScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
