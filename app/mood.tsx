import { useRouter } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function MoodPage() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Mood</Text>
      <Pressable style={styles.button} onPress={() => router.push("/flights")}>
        <Text style={styles.buttonText}>Go To Flights</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", gap: 16, padding: 16 },
  title: { fontSize: 24, fontWeight: "600" },
  button: { backgroundColor: "#0ea5e9", paddingVertical: 12, paddingHorizontal: 20, borderRadius: 8 },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "600" }
});
