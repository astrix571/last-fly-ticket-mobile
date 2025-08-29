import { EXPO_PUBLIC_TRAVEL_API_KEY } from "@env";
import axios from "axios";

export interface Flight {
  cityFrom: string;
  cityTo: string;
  price: number;
  id: string;
}

const API_URL = "https://DataCrawler-api.p.rapidapi.com/google-flights2/search";

export async function searchFlights(params: {
  origin: string;
  destination: string;
  outbound_date: string;
  currency?: string;
  country_code?: string;
  language_code?: string;
}): Promise<Flight[]> {
  try {
    const response = await axios.get(API_URL, {
      params: {
        ...params,
        show_hidden: 1,
      },
      headers: {
        "x-rapidapi-key": EXPO_PUBLIC_TRAVEL_API_KEY,
        "x-rapidapi-host": "DataCrawler-api.p.rapidapi.com",
      },
    });

    const flightsRaw = response.data?.message ?? [];

    const flights: Flight[] = flightsRaw.map((f: any, index: number) => ({
      id: `flight-${index}`,
      cityFrom: params.origin,
      cityTo: params.destination,
      price: f.price || f.ticket_price || 0,
    }));

    return flights;
  } catch {
    return [];
  }
}
