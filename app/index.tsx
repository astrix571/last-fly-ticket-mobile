import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

const moods = ['calm', 'adventure', 'escape', 'love'];

export default function HomeScreen() {
  const router = useRouter();

  const handleMoodSelect = (mood: string) => {
    router.push({ pathname: '/destinations', params: { mood } });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>How do you feel today?</Text>
      {moods.map((mood) => (
        <Pressable key={mood} style={styles.button} onPress={() => handleMoodSelect(mood)}>
          <Text style={styles.buttonText}>{mood.toUpperCase()}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 32, textAlign: 'center' },
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
  },
  buttonText: { color: 'white', fontSize: 18, textAlign: 'center' },
});
