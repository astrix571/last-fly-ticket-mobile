import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import { Flight, searchFlights } from "../services/googleFlights";

export default function FlightsScreen() {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);

  const origin = "TLV";
  const destination = "ATH";
  const date = "2025-09-10";
  useEffect(() => {
    const fetchFlights = async () => {
      const res = await searchFlights({
        origin,
        destination,
        outbound_date: date,
        currency: "USD",
        country_code: "US",
        language_code: "en-US",
      });
      setFlights(res);
      setLoading(false);
    };
  
    fetchFlights();
  }, []);
  

  if (loading) {
    return (
      <View>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View>
      {flights.length === 0 ? (
        <Text>No flights found.</Text>
      ) : (
        <FlatList
          data={flights}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View>
              <Text>{item.cityFrom} → {item.cityTo}</Text>
              <Text>${item.price}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}
