// app/(tabs)/home.tsx
import * as Location from 'expo-location';
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { getFlights } from '../../services/kiwi';

type MoodKey = 'calm' | 'adventure' | 'escape' | 'love' | 'spiritual';

const MOOD_MAP: Record<MoodKey, string[]> = {
  calm: ['ATH', 'LIS', 'VIE', 'OSL', 'LJU'],
  adventure: ['BCN', 'CPT', 'BKK', 'RIO', 'IST'],
  escape: ['LCA', 'NAP', 'TIV', 'TUN', 'SOF'],
  love: ['ROM', 'PAR', 'VEN', 'BUD', 'PRG'],
  spiritual: ['DEL', 'CAI', 'AMM', 'MCT', 'LHE'],
};

export default function HomeScreen() {
  // location
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [locError, setLocError] = useState<string | null>(null);
  const [locLoading, setLocLoading] = useState(true);

  // mood + destination flow
  const [mood, setMood] = useState<MoodKey | null>(null);
  const [shown, setShown] = useState<string[]>([]);
  const [currentIata, setCurrentIata] = useState<string | null>(null);

  // flights fetching
  const [loading, setLoading] = useState(false);
  const [flightSummary, setFlightSummary] = useState<string | null>(null);

  // request user location on mount
  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setLocError('Location permission is required to find flights near you.');
          return;
        }
        const pos = await Location.getCurrentPositionAsync({});
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      } catch (e) {
        setLocError('Failed to fetch location. Please try again.');
      } finally {
        setLocLoading(false);
      }
    })();
  }, []);

  const moodKeys = useMemo(() => Object.keys(MOOD_MAP) as MoodKey[], []);

  const onPickMood = (m: MoodKey) => {
    setMood(m);
    setShown([]);
    setCurrentIata(null);
    setFlightSummary(null);
    fetchNextDestination(m, []);
  };

  const fetchNextDestination = async (m: MoodKey, alreadyShown: string[]) => {
    // choose unique IATA from the 5
    const options = MOOD_MAP[m].filter((iata) => !alreadyShown.includes(iata));
    if (options.length === 0) {
      Alert.alert('No more suggestions', 'You have viewed all 5 destinations for this mood.');
      return;
    }
    const next = options[Math.floor(Math.random() * options.length)];

    if (!coords) {
      Alert.alert('Location missing', 'Please allow location or try again.');
      return;
    }

    setLoading(true);
    setFlightSummary(null);

    try {
      // origin: "lat-lng" format per our kiwi.ts contract
      const origin = `${coords.lat}-${coords.lng}`;
      const data = await getFlights({
        origin,
        destination: next,
        // Optional: you can add dateFrom/dateTo if you want strict windows
        limit: 5,
        currency: 'usd',
        locale: 'en',
      });

      // Defensive parsing — try to extract something meaningful to show
      // We don't assume exact shape. Try common fields.
      let summary = `Destination: ${next}`;
      if (data) {
        // try a few common shapes:
        const first =
          (Array.isArray(data?.data) && data.data[0]) ||
          (Array.isArray(data?.results) && data.results[0]) ||
          (Array.isArray(data) && data[0]) ||
          null;

        const price =
          first?.price ??
          first?.conversion?.USD ??
          first?.fare ??
          first?.cost ??
          undefined;

        const airline =
          first?.airlines?.[0] ??
          first?.airline ??
          (first?.route && first.route[0]?.airline) ??
          undefined;

        const depart =
          first?.local_departure ??
          first?.departure_time ??
          first?.dTimeUTC ??
          undefined;

        const fromCode =
          first?.cityFrom ??
          first?.flyFrom ??
          (first?.route && first.route[0]?.flyFrom) ??
          undefined;

        const toCode =
          first?.cityTo ??
          first?.flyTo ??
          (first?.route && first.route[first.route.length - 1]?.flyTo) ??
          next;

        const parts: string[] = [];
        parts.push(`To: ${toCode}`);
        if (fromCode) parts.push(`From: ${fromCode}`);
        if (price !== undefined) parts.push(`Price: ${price}`);
        if (airline) parts.push(`Airline: ${airline}`);
        if (depart) parts.push(`Departure: ${String(depart)}`);

        summary = parts.join(' • ');
      }

      setCurrentIata(next);
      setShown([...alreadyShown, next]);
      setFlightSummary(summary);
    } catch (err: any) {
      Alert.alert('Flight search failed', err?.message ?? 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const onShowAnother = () => {
    if (!mood) return;
    fetchNextDestination(mood, shown);
  };

  const onRetryLocation = async () => {
    setLocLoading(true);
    setLocError(null);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocError('Location permission is required to find flights near you.');
        return;
      }
      const pos = await Location.getCurrentPositionAsync({});
      setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
    } catch {
      setLocError('Failed to fetch location. Please try again.');
    } finally {
      setLocLoading(false);
    }
  };

  // UI
  return (
    <View style={styles.container}>
      <Text style={styles.title}>How do you feel today?</Text>

      {/* Location state */}
      {locLoading && <ActivityIndicator size="large" />}

      {!locLoading && locError && (
        <View style={styles.noticeBox}>
          <Text style={styles.noticeText}>{locError}</Text>
          <Pressable style={styles.secondaryBtn} onPress={onRetryLocation}>
            <Text style={styles.secondaryBtnText}>Retry</Text>
          </Pressable>
        </View>
      )}

      {/* Mood buttons (show only when location is ready or user skipped) */}
      {!locLoading && !mood && (
        <View style={styles.grid}>
          {moodKeys.map((m) => (
            <Pressable key={m} style={styles.moodBtn} onPress={() => onPickMood(m)}>
              <Text style={styles.moodBtnText}>{m.charAt(0).toUpperCase() + m.slice(1)}</Text>
            </Pressable>
          ))}
        </View>
      )}

      {/* Loading flight */}
      {loading && <ActivityIndicator size="large" />}

      {/* Result */}
      {currentIata && !loading && (
        <View style={styles.resultBox}>
          <Text style={styles.resultTitle}>Suggestion</Text>
          <Text style={styles.resultText}>{flightSummary ?? `Destination: ${currentIata}`}</Text>

          <Pressable style={styles.linkBtn} onPress={onShowAnother}>
            <Text style={styles.linkBtnText}>Show another</Text>
          </Pressable>

          <Pressable style={styles.secondaryBtn} onPress={() => setMood(null)}>
            <Text style={styles.secondaryBtnText}>Change mood</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff', justifyContent: 'center' },
  title: { fontSize: 22, fontWeight: '600', textAlign: 'center', marginBottom: 24 },

  grid: { gap: 12 },
  moodBtn: {
    backgroundColor: '#0A84FF',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  moodBtnText: { color: '#fff', fontSize: 18, fontWeight: '600' },

  noticeBox: { alignItems: 'center', gap: 10, marginBottom: 20 },
  noticeText: { textAlign: 'center', fontSize: 14 },

  resultBox: { marginTop: 24, alignItems: 'center', gap: 12 },
  resultTitle: { fontSize: 18, fontWeight: '700' },
  resultText: { fontSize: 16, textAlign: 'center' },

  linkBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#0A84FF',
    marginTop: 8,
  },
  linkBtnText: { color: '#fff', fontSize: 16, fontWeight: '600' },

  secondaryBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    marginTop: 8,
  },
  secondaryBtnText: { fontSize: 16 },
});
