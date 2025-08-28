import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { getFlights } from '../services/kiwi';

export default function HomeScreen() {
  const destinations = [
    { label: 'Barcelona (BCN)', value: 'BCN' },
    { label: 'Athens (ATH)', value: 'ATH' },
    { label: 'Rome (FCO)', value: 'FCO' },
    { label: 'Amsterdam (AMS)', value: 'AMS' },
    { label: 'Lisbon (LIS)', value: 'LIS' },
  ];

  const [selected, setSelected] = useState<string | null>(null);
  const [flights, setFlights] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFlights = async () => {
      if (!selected) return;

      setLoading(true);
      try {
        const res = await getFlights({
          origin: 'TLV',
          destination: selected,
          dateFrom: '01/09/2025',
          dateTo: '05/09/2025',
          limit: 5,
        });
        setFlights(res.data || []);
      } catch (err) {
        console.error('API Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFlights();
  }, [selected]);

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 18, marginBottom: 10 }}>Choose a destination:</Text>

      <RNPickerSelect
        onValueChange={(value) => setSelected(value)}
        items={destinations}
        placeholder={{ label: 'Select city...', value: null }}
      />

      {loading && <ActivityIndicator style={{ marginTop: 20 }} />}

      {!loading && flights.length > 0 && (
        <FlatList
          data={flights}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={{ marginVertical: 10, padding: 10, borderWidth: 1, borderRadius: 8 }}>
              <Text>{item.cityFrom} → {item.cityTo}</Text>
              <Text>Price: ${item.price}</Text>
              <Text>Date: {item.route?.[0]?.local_departure?.slice(0, 10)}</Text>
              <Text>Airline: {item.route?.[0]?.airline}</Text>
            </View>
          )}
        />
      )}

      {!loading && selected && flights.length === 0 && (
        <Text style={{ marginTop: 20 }}>No flights found.</Text>
      )}
    </View>
  );
}
