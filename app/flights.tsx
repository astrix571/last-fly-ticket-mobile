import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { getFlights } from '../services/kiwi';

export default function FlightsScreen() {
  const { origin, destination, dateFrom, dateTo } = useLocalSearchParams();
  const [flights, setFlights] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        const res = await getFlights({
          origin: origin as string,
          destination: destination as string,
          dateFrom: dateFrom as string,
          dateTo: dateTo as string,
          limit: 5,
        });
        setFlights(res.data || []);
      } catch (err: any) {
        setError(err.message || 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchFlights();
  }, []);

  if (loading) return <ActivityIndicator size="large" style={styles.centered} />;
  if (error) return <Text style={styles.error}>❌ {error}</Text>;
  if (flights.length === 0) return <Text style={styles.empty}>No flights found</Text>;

  return (
    <FlatList
      data={flights}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.list}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Text style={styles.route}>
            ✈️ {item.cityFrom} → {item.cityTo}
          </Text>
          <Text>Date: {item.route?.[0]?.local_departure?.slice(0, 10)}</Text>
          <Text>Return: {item.route?.[1]?.local_departure?.slice(0, 10)}</Text>
          <Text>Airline: {item.route?.[0]?.airline}</Text>
          <Text>Price: ${item.price}</Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  error: { color: 'red', textAlign: 'center', marginTop: 20 },
  empty: { textAlign: 'center', marginTop: 20 },
  list: { padding: 16 },
  card: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  route: { fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
});
