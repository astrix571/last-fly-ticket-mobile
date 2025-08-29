import { EXPO_PUBLIC_TRAVEL_API_KEY } from "@env";
import axios from "axios";

const API_URL = "https://datacrawler-api-google-flights2.p.rapidapi.com/api/google-flights2/";

export interface Flight {
  id: string;
  cityFrom: string;
  cityTo: string;
  price: number;
}

interface FlightSearchParams {
  origin: string;
  destination: string;
  outbound_date: string;
  currency: string;
  country_code: string;
  language_code: string;
}

export async function searchFlights(params: FlightSearchParams): Promise<Flight[]> {
  try {
    const response = await axios.get(`${API_URL}searchFlights`, {
      params: {
        ...params,
        show_hidden: 1,
      },
      headers: {
        "X-RapidAPI-Key": EXPO_PUBLIC_TRAVEL_API_KEY,
        "X-RapidAPI-Host": "datacrawler-api-google-flights2.p.rapidapi.com",
      },
    });

    const results = response.data?.results || [];

    const flights: Flight[] = results.map((item: any, index: number) => ({
      id: `flight-${index}`,
      cityFrom: item.origin,
      cityTo: item.destination,
      price: item.price,
    }));

    return flights;
  } catch (error: any) {
    console.error("API Error:", error.response?.data || error.message);
    return [];
  }
}
