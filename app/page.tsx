import { useRouter } from 'expo-router';
import { View, Text, Pressable, StyleSheet } from 'react-native';

export default function MoodScreen() {
  const router = useRouter();

  const handleMoodSelect = () => {
    router.push('/destinations');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose your mood</Text>
      <Pressable style={styles.button} onPress={handleMoodSelect}>
        <Text style={styles.buttonText}>Happy</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  title: {
    fontSize: 24,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
});
