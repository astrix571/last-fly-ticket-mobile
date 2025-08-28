import * as Location from 'expo-location';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { getFlights } from '../../services/kiwi';

const moods = {
  calm: ['ATH', 'LIS', 'VIE', 'OSL', 'LJU'],
  adventure: ['BCN', 'CPT', 'BKK', 'RIO', 'IST'],
  escape: ['LCA', 'NAP', 'TIV', 'TUN', 'SOF'],
  love: ['ROM', 'PAR', 'VEN', 'BUD', 'PRG'],
  spiritual: ['DEL', 'CAI', 'AMM', 'MCT', 'LHE'],
};

export default function HomeScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [mood, setMood] = useState<string | null>(null);
  const [shownDestinations, setShownDestinations] = useState<string[]>([]);
  const [currentDestination, setCurrentDestination] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // בקשת הרשאת מיקום
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Location Needed',
          'We need your location to find the best flights for you.',
        );
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      setLocation(loc);
    })();
  }, []);

  const handleMoodPress = (selectedMood: string) => {
    setMood(selectedMood);
    setShownDestinations([]);
    pickDestination(selectedMood, []);
  };

  const pickDestination = async (moodKey: string, alreadyShown: string[]) => {
    const options = moods[moodKey].filter((iata) => !alreadyShown.includes(iata));

    if (options.length === 0) {
      Alert.alert('No more destinations', 'You have seen all options for this mood.');
      return;
    }

    const randomIATA = options[Math.floor(Math.random() * options.length)];
    setIsLoading(true);

    try {
      const coords = location?.coords;
      if (!coords) throw new Error('No location available');

      const flight = await getFlights({
        flyFrom: `${coords.latitude}-${coords.longitude}`,
        to: randomIATA,
      });

      setCurrentDestination(flight);
      setShownDestinations([...alreadyShown, randomIATA]);
    } catch (err) {
      Alert.alert('Error fetching flight', (err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleShowAnother = () => {
    if (!mood) return;
    pickDestination(mood, shownDestinations);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>How do you feel today?</Text>

      {!mood &&
        Object.keys(moods).map((m) => (
          <Pressable key={m} style={styles.button} onPress={() => handleMoodPress(m)}>
            <Text style={styles.buttonText}>{m.charAt(0).toUpperCase() + m.slice(1)}</Text>
          </Pressable>
        ))}

      {isLoading && <ActivityIndicator size="large" color="#000" />}

      {currentDestination && (
        <View style={styles.resultBox}>
          <Text style={styles.resultText}>Let’s fly to {currentDestination} ✈️</Text>
          <Pressable onPress={handleShowAnother}>
            <Text style={styles.link}>Show another</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    marginBottom: 30,
    textAlign: 'center',
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#0077cc',
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 18,
  },
  resultBox: {
    marginTop: 40,
    alignItems: 'center',
  },
  resultText: {
    fontSize: 20,
    marginBottom: 15,
  },
  link: {
    fontSize: 16,
    color: 'blue',
  },
});
