import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { getFlights } from '../services/kiwi'; // ודא שזה קיים

export default function FlightsScreen() {
  const { iata, mood } = useLocalSearchParams<{ iata: string; mood: string }>();
  const [flights, setFlights] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        const res = await getFlights({
          origin: 'TLV',
          destination: iata,
          dateFrom: '01/09/2025',
          dateTo: '05/09/2025',
          limit: 5,
        });
        setFlights(res.data || []);
      } catch (error) {
        console.error('❌ Error fetching flights:', error);
      } finally {
        setLoading(false);
      }
    };

    if (iata) {
      fetchFlights();
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
            <Text>Airline: {item.route?.[0]?.airline}</Text>
            <Text>Date: {item.route?.[0]?.local_departure?.slice(0, 10)}</Text>
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
