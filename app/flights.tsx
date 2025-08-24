import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Flight, getFlights } from '../../services/flights';

export default function FlightsScreen() {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFlights() {
      try {
        const data = await getFlights();
        setFlights(data);
      } catch (error) {
        console.error('Failed to load flights:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchFlights();
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (flights.length === 0) {
    return (
      <View style={styles.centered}>
        <Text>No flights found.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={flights}
      keyExtractor={(_, index) => index.toString()}
      contentContainerStyle={styles.container}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Text style={styles.route}>
            {item.cityFrom} → {item.cityTo}
          </Text>
          <Text style={styles.date}>
            {new Date(item.dTime * 1000).toLocaleDateString()}
          </Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    padding: 16,
    marginBottom: 12,
    backgroundColor: '#f1f1f1',
    borderRadius: 8,
  },
  route: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  date: {
    fontSize: 14,
    color: '#555',
  },
});
