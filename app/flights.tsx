import React, { useCallback, useState } from 'react';
import {
    FlatList,
    RefreshControl,
    StyleSheet,
    Text,
    View,
} from 'react-native';

interface Flight {
  from: string;
  to: string;
  depart: string;
  price: number;
  currency: string;
}

export default function FlightsScreen() {
  const [data, setData] = useState<Flight[]>([]);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [raw, setRaw] = useState<any>(null);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      const mockData: Flight[] = [
        {
          from: 'Tel Aviv',
          to: 'London',
          depart: '2025-09-15T15:30:00',
          price: 329,
          currency: 'USD',
        },
      ];
      setData(mockData);
      setRaw(mockData);
      setRefreshing(false);
    }, 1500);
  }, []);

  const renderItem = ({ item }: { item: Flight }) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.from} → {item.to}</Text>
      <Text style={styles.line}>Departure: {item.depart || '--'}</Text>
      <Text style={styles.line}>Price: {item.price} {item.currency}</Text>
    </View>
  );

  if (!data?.length && raw) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Raw API Response:</Text>
        <Text selectable style={styles.code}>
          {JSON.stringify(raw, null, 2)}
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      style={styles.container}
      data={data}
      keyExtractor={(_, idx) => String(idx)}
      renderItem={renderItem}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      ListHeaderComponent={<Text style={styles.header}>Flight Search Results</Text>}
      ListEmptyComponent={<Text style={styles.mono}>No flights found.</Text>}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  line: {
    fontSize: 14,
    marginTop: 2,
  },
  card: {
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#f4f4f4',
    marginBottom: 10,
  },
  mono: {
    fontFamily: 'System',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 20,
  },
  code: {
    fontFamily: 'Menlo',
    fontSize: 12,
    marginTop: 8,
  },
});
