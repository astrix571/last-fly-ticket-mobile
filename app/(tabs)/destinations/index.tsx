import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

const moodDestinations: Record<string, { city: string; iata: string }[]> = {
  adventure: [
    { city: 'Barcelona', iata: 'BCN' },
    { city: 'Athens', iata: 'ATH' },
    { city: 'Rome', iata: 'FCO' },
  ],
  calm: [
    { city: 'Mykonos', iata: 'JMK' },
    { city: 'Nice', iata: 'NCE' },
    { city: 'Split', iata: 'SPU' },
  ],
  escape: [
    { city: 'Larnaca', iata: 'LCA' },
    { city: 'Palma', iata: 'PMI' },
    { city: 'Malta', iata: 'MLA' },
  ],
  love: [
    { city: 'Venice', iata: 'VCE' },
    { city: 'Paris', iata: 'CDG' },
    { city: 'Florence', iata: 'FLR' },
  ],
};

export default function DestinationsScreen() {
  const { mood } = useLocalSearchParams<{ mood: string }>();
  const router = useRouter();

  if (!mood || !moodDestinations[mood]) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>No destinations found for this mood.</Text>
      </View>
    );
  }

  const handleSelect = (iata: string) => {
    router.push({ pathname: '/flights', params: { iata, mood } });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose your destination</Text>
      {moodDestinations[mood].map((dest) => (
        <Pressable
          key={dest.iata}
          style={styles.button}
          onPress={() => handleSelect(dest.iata)}
        >
          <Text style={styles.buttonText}>{dest.city} ({dest.iata})</Text>
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
