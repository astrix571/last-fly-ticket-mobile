import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { getFlights } from '../services/flights';

type Flight = {
  id: string;
  from: string;
  to: string;
  date: string;
};

export default function FlightsScreen() {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFlights = async () => {
      const data = await getFlights();
      setFlights(data);
      setLoading(false);
    };
    loadFlights();
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <FlatList
      data={flights}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.container}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Text style={styles.route}>{item.from} → {item.to}</Text>
          <Text style={styles.date}>{item.date}</Text>
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
