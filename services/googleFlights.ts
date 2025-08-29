import { EXPO_PUBLIC_TRAVEL_API_KEY } from "@env";
import axios from "axios";

export interface FlightSearchResponse {
  status: boolean;
  message: string | null;
  data?: any;
}

const API_URL = "https://DataCrawler-api.p.rapidapi.com/google-flights2/search";

export async function searchFlights(params: {
  origin: string;
  destination: string;
  outbound_date: string;
  adults?: number;
  currency?: string;
  country_code?: string;
  language_code?: string;
}): Promise<FlightSearchResponse> {
  try {
    const response = await axios.get(API_URL, {
      params: {
        ...params,
        show_hidden: 1,
      },
      headers: {
        "x-rapidapi-key": EXPO_PUBLIC_TRAVEL_API_KEY,
        "x-rapidapi-host": "DataCrawler-api.p.rapidapi.com"
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("Error calling Google Flights API:", error.response?.status, error.message);
    return { status: false, message: error.message };
  }
}
