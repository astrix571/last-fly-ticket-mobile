// services/googleFlights.ts

import { EXPO_PUBLIC_TRAVEL_API_KEY } from "@env";
import axios from "axios";
import { format } from "date-fns";

const API_URL =
  "https://datacrawler-api-google-flights2.p.rapidapi.com/api/google-flights2/";

export interface FlightSearchParams {
  origin: string;
  destination: string;
  outbound_date: string;
  currency: string;
  country_code: string;
  language_code: string;
}

export async function searchFlights(params: FlightSearchParams) {
  try {
    const response = await axios.get(`${API_URL}searchFlights`, {
      params,
      headers: {
        "X-RapidAPI-Key": EXPO_PUBLIC_TRAVEL_API_KEY,
        "X-RapidAPI-Host": "datacrawler-api-google-flights2.p.rapidapi.com",
      },
    });

    return response.data;
  } catch (error: any) {
    console.error("❌ API Error:", error.response?.data || error.message);
    return null;
  }
}

// Test run
(async () => {
  const result = await searchFlights({
    origin: "TLV",
    destination: "LON",
    outbound_date: format(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), "yyyy-MM-dd"),
    currency: "USD",
    country_code: "US",
    language_code: "en-US",
  });

  console.log("✈️ API Response:", JSON.stringify(result, null, 2));
})();
