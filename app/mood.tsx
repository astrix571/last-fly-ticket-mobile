import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { getFlights } from '../services/kiwi'; // ודא שהקובץ הזה קיים עם הפונקציה getFlights

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

export default function MoodScreen() {
  const { mood } = useLocalSearchParams<{ mood: string }>();
  const [selected, setSelected] = useState<string | null>(null);
  const [flights, setFlights] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSelectDestination = async (iata: string) => {
    setSelected(iata);
    setLoading(true);
    try {
      const res = await getFlights({
        origin: 'TLV',
        destination: iata,
        dateFrom: '01/09/2025',
        dateTo: '05/09/2025',
        limit: 5,
      });
      setFlights(res.data || []);
    } catch (err) {
      console.error('❌ Error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!mood || !moodDestinations[mood]) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Unknown mood selected.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Destinations for "{mood}"</Text>

      {moodDestinations[mood].map((dest) => (
        <Pressable
          key={dest.iata}
          style={styles.button}
          onPress={() => handleSelectDestination(dest.iata)}
        >
          <Text style={styles.buttonText}>{dest.city} ({dest.iata})</Text>
        </Pressable>
      ))}

      {loading && <ActivityIndicator style={{ marginTop: 20 }} />}

      {!loading && selected && flights.length > 0 && (
        <FlatList
          data={flights}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text>{item.cityFrom} → {item.cityTo}</Text>
              <Text>Price: ${item.price}</Text>
              <Text>Airline: {item.route?.[0]?.airline}</Text>
              <Text>Date: {item.route?.[0]?.local_departure?.slice(0, 10)}</Text>
            </View>
          )}
          style={{ marginTop: 20 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
  button: {
    backgroundColor: '#007aff',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
  },
  buttonText: { color: 'white', fontWeight: 'bold', textAlign: 'center' },
  card: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
});
