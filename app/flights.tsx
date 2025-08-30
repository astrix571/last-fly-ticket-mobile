import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import { Flight, getFlights } from "../../services/googleFlights";


export default function FlightsPage() {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);
  const destinations = ["ATH", "BCN", "FCO", "CDG", "VCE", "JMK", "NCE", "SPU"];
  const arrival = destinations[Math.floor(Math.random() * destinations.length)];

  useEffect(() => {
    let mounted = true;
    (async () => {
      const res = await getFlights(arrival);
      if (!mounted) return;
      setFlights(res);
      setLoading(false);
    })();
    return () => { mounted = false; };
  }, [arrival]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 16 }}>
      {flights.length === 0 ? (
        <Text>No flights found.</Text>
      ) : (
        <FlatList
          data={flights}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={{ paddingVertical: 12, borderBottomWidth: 1, borderColor: "#e5e7eb" }}>
              <Text>{item.cityFrom} → {item.cityTo}</Text>
              <Text>${item.price}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}
