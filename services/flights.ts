import { EXPO_PUBLIC_TRAVEL_API_KEY } from "@env"; // ✅ שימוש נכון לפי ההגדרה שלך
import axios from "axios";
import { format } from "date-fns";

export interface Flight {
  cityFrom: string;
  cityTo: string;
  price: number;
  id: string;
}

const API_URL = "https://api.travelpayouts.com/v2/prices/latest";

export async function getFlights(destination: string): Promise<Flight[]> {
  const origin = "TLV";
  const begin = format(new Date(), "yyyy-MM-01");

  try {
    console.log("📡 Fetching flights from", origin, "to:", destination);

    const response = await axios.get(API_URL, {
      params: {
        origin,
        destination,
        currency: "usd",
        beginning_of_period: begin,
        period_type: "month",
        show_to_affiliates: true,
        token: EXPO_PUBLIC_TRAVEL_API_KEY, // ✅ שימוש נכון כאן
      },
      headers: {
        "Accept-Encoding": "gzip, deflate",
      },
    });

    const dataArr = response.data.data;
    if (!dataArr || !Array.isArray(dataArr)) return [];

    const flights: Flight[] = dataArr.map((f: any, index: number) => ({
      id: `flight-${index}`,
      cityFrom: f.origin,
      cityTo: f.destination,
      price: f.value,
    }));

    console.log("✅ Flights received:", flights.length);
    return flights;
  } catch (error: any) {
    console.error("🛑 Error fetching flights:", error.response?.status, error.message);
    return [];
  }
}
