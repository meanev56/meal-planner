/**
 * @format
 */

import { Stack } from "expo-router";
import { ModalPortal } from "react-native-modals";

export default function RootLayout() {
  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "slide_from_right",
        }}
      >
        {/* Modal Screens */}
        <Stack.Screen
          name="copy-modal"
          options={{
            presentation: "modal",
            animation: "slide_from_bottom",
          }}
        />
        <Stack.Screen
          name="delete-modal"
          options={{
            presentation: "modal",
            animation: "slide_from_bottom",
          }}
        />
      </Stack>

      <ModalPortal />
    </>
  );
}