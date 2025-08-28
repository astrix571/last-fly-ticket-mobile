import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { Flight, getFlights } from '../services/flights';

export default function FlightsScreen() {
  const { iata, mood } = useLocalSearchParams<{ iata: string; mood: string }>();
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFlights = async () => {
      console.log("📡 Fetching flights from TLV to:", iata);
      if (!iata) return;

      const res = await getFlights(iata);
      console.log("✅ Flights data:", res);
      setFlights(res);
      setLoading(false);
    };

    if (iata) {
      fetchFlights();
    } else {
      setLoading(false);
    }
  }, [iata]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Flights for mood: {mood}</Text>

      {loading && <ActivityIndicator size="large" style={{ marginTop: 20 }} />}
      {!loading && flights.length === 0 && (
        <Text style={{ marginTop: 20 }}>No flights found for {iata}.</Text>
      )}

      <FlatList
        data={flights}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text>{item.cityFrom} → {item.cityTo}</Text>
            <Text>Price: ${item.price}</Text>
          </View>
        )}
        style={{ marginTop: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  card: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
});
