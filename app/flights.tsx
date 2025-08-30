import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import { Flight, getFlights } from "../services/flights";

export default function FlightsScreen() {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);

  const departure_id = "TLV";
  const destinations = ["ATH", "BCN", "FCO", "CDG", "VCE", "JMK", "NCE", "SPU"];
  const arrival_id = destinations[Math.floor(Math.random() * destinations.length)];

  useEffect(() => {
    const fetchFlights = async () => {
      const res = await getFlights(arrival_id);
      setFlights(res || []);
      setLoading(false);
    };

    fetchFlights();
  }, [arrival_id]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={{ padding: 16 }}>
      {flights.length === 0 ? (
        <Text>No flights found.</Text>
      ) : (
        <FlatList
          data={flights}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={{ marginBottom: 16 }}>
              <Text>{item.cityFrom} → {item.cityTo}</Text>
              <Text>${item.price}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}
