import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack initialRouteName="mood">
      <Stack.Screen name="mood" options={{ title: "Mood" }} />
      <Stack.Screen name="flights" options={{ title: "Flights" }} />
    </Stack>
  );
}
