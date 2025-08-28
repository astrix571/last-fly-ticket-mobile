import { useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { getFlights } from '../services/kiwi';

const moodDestinations = {
  adventure: [
    { city: 'Barcelona', iata: 'BCN' },
    { city: 'Athens', iata: 'ATH' },
    { city: 'Rome', iata: 'FCO' },
    { city: 'Amsterdam', iata: 'AMS' },
    { city: 'Lisbon', iata: 'LIS' },
  ],
  chill: [
    { city: 'Mykonos', iata: 'JMK' },
    { city: 'Santorini', iata: 'JTR' },
    { city: 'Nice', iata: 'NCE' },
    { city: 'Palma', iata: 'PMI' },
    { city: 'Split', iata: 'SPU' },
  ],
  romantic: [
    { city: 'Venice', iata: 'VCE' },
    { city: 'Paris', iata: 'CDG' },
    { city: 'Prague', iata: 'PRG' },
    { city: 'Vienna', iata: 'VIE' },
    { city: 'Florence', iata: 'FLR' },
  ],
};

export default function MoodScreen() {
  const [mood, setMood] = useState<string | null>(null);
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

  return (
    <View style={{ flex: 1, padding: 20 }}>
      {!mood && (
        <>
          <Text style={styles.title}>How do you feel today?</Text>
          {Object.keys(moodDestinations).map((m) => (
            <Pressable key={m} style={styles.button} onPress={() => setMood(m)}>
              <Text style={styles.buttonText}>{m.toUpperCase()}</Text>
            </Pressable>
          ))}
        </>
      )}

      {mood && (
        <>
          <Text style={styles.title}>Pick a destination for "{mood}"</Text>
          <RNPickerSelect
            onValueChange={handleSelectDestination}
            items={moodDestinations[mood].map((d) => ({
              label: `${d.city} (${d.iata})`,
              value: d.iata,
            }))}
            placeholder={{ label: 'Select city...', value: null }}
          />

          {loading && <ActivityIndicator style={{ marginTop: 20 }} />}

          {!loading && flights.length > 0 && (
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
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
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
