import axios from "axios";

const API_URL = "https://google-flights2.p.rapidapi.com/api/v1/searchFlights";
const API_KEY = process.env.EXPO_PUBLIC_TRAVEL_API_KEY;

export interface FlightSearchParams {
  departure_id: string;
  arrival_id: string;
  adults?: string;
  currency?: string;
  language_code?: string;
  country_code?: string;
  travel_class?: string;
  show_hidden?: string;
  search_type?: string;
}

export interface Flight {
  id: string;
  price: number;
  cityFrom: string;
  cityTo: string;
  departureTime: string;
  arrivalTime: string;
  airline: string;
}

export async function searchFlights(params: FlightSearchParams): Promise<Flight[]> {
  try {
    const response = await axios.get(API_URL, {
      params: {
        ...params,
        adults: params.adults || "1",
        currency: params.currency || "USD",
        language_code: params.language_code || "en-US",
        country_code: params.country_code || "US",
        travel_class: params.travel_class || "ECONOMY",
        show_hidden: params.show_hidden || "true",
        search_type: params.search_type || "best",
      },
      headers: {
        "x-rapidapi-host": "google-flights2.p.rapidapi.com",
        "x-rapidapi-key": API_KEY,
      },
    });

    const results = response.data.flights || [];

    return results.map((flight: any, index: number) => ({
      id: flight.id || `flight-${index}`,
      price: flight.price || 0,
      cityFrom: flight.departureCity || "",
      cityTo: flight.arrivalCity || "",
      departureTime: flight.departureTime || "",
      arrivalTime: flight.arrivalTime || "",
      airline: flight.airline || "",
    }));
  } catch (error: any) {
    console.error("API error:", error?.response?.data || error.message);
    return [];
  }
}
