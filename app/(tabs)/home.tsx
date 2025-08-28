import { useState } from 'react';
import { Text, View } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';

export default function HomeScreen() {
  const destinations = [
    { label: 'Barcelona (BCN)', value: 'BCN' },
    { label: 'Athens (ATH)', value: 'ATH' },
    { label: 'Rome (FCO)', value: 'FCO' },
    { label: 'Amsterdam (AMS)', value: 'AMS' },
    { label: 'Lisbon (LIS)', value: 'LIS' },
  ];

  const [selected, setSelected] = useState<string | null>(null);

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 18, marginBottom: 10 }}>Choose a destination:</Text>

      <RNPickerSelect
        onValueChange={(value) => setSelected(value)}
        items={destinations}
        placeholder={{ label: 'Select city...', value: null }}
      />

      {selected && <Text style={{ marginTop: 20 }}>Selected IATA: {selected}</Text>}
    </View>
  );
}
