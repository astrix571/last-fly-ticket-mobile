import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

const moods = ['adventure', 'chill', 'romantic', 'surprise'];

export default function HomeScreen() {
  const handleMoodSelect = (mood: string) => {
    router.push({
      pathname: '/destinations',
      params: { mood },
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select your mood:</Text>
      {moods.map((mood) => (
        <Pressable key={mood} style={styles.button} onPress={() => handleMoodSelect(mood)}>
          <Text style={styles.buttonText}>{mood.toUpperCase()}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 22, textAlign: 'center', marginBottom: 20 },
  button: {
    backgroundColor: '#007aff',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
  },
  buttonText: { color: 'white', fontWeight: 'bold', textAlign: 'center' },
});
