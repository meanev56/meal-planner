/**
 * @format
 */

import { name as appName } from "@/app.json";
import { Stack } from "expo-router";
import { AppRegistry } from "react-native";
import { ModalPortal } from "react-native-modals";

export default function RootLayout() {
  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,        // Hide default header if you want full control
        }}
      />
      <ModalPortal />
    </>
  );
}

// Register the app (kept for compatibility with bare React Native style)
AppRegistry.registerComponent(appName, () => RootLayout);