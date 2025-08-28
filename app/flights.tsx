import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { getFlights } from '../services/kiwi';

export default function FlightsScreen() {
  const { origin, destination, dateFrom, dateTo } = useLocalSearchParams();
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      console.log('📡 Fetching flights for:', origin, destination);
      try {
        const res = await getFlights({
          origin: origin as string,
          destination: destination as string,
          dateFrom: dateFrom as string,
          dateTo: dateTo as string,
          limit: 5,
        });
        console.log('✅ Flights received:', res.data);
        setFlights(res.data || []);
      } catch (err) {
        console.error('❌ Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, []);

  if (loading) return <ActivityIndicator style={styles.centered} />;

  return (
    <FlatList
      data={flights}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.list}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Text>{item.cityFrom} → {item.cityTo}</Text>
          <Text>Price: ${item.price}</Text>
          <Text>Airline: {item.route?.[0]?.airline}</Text>
          <Text>Date: {item.route?.[0]?.local_departure?.slice(0, 10)}</Text>
        </View>
      )}
      ListEmptyComponent={<Text style={{ textAlign: 'center' }}>No flights found.</Text>}
    />
  );
}

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  list: { padding: 16 },
  card: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
});
