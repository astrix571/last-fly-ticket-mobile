import axios from "axios";

export interface Flight {
  id: string;
  cityFrom: string;
  cityTo: string;
  price: number;
}

const RAPID_KEY = process.env.EXPO_PUBLIC_TRAVEL_API_KEY!;
const API_URL = "https://google-flights-search.p.rapidapi.com/search";
const API_HOST = "google-flights-search.p.rapidapi.com";

export async function getFlights(destination: string): Promise<Flight[]> {
  if (!RAPID_KEY) return [];
  try {
    const res = await axios.get(API_URL, {
      params: {
        departure_id: "TLV",
        arrival_id: destination,
        currency: "USD",
        country_code: "US",
        language_code: "en-US",
        travel_class: "ECONOMY",
        show_hidden: "false",
        search_type: "best",
        adults: "1"
      },
      headers: {
        "X-RapidAPI-Key": RAPID_KEY,
        "X-RapidAPI-Host": API_HOST
      },
      timeout: 20000
    });

    const items = res.data?.data ?? res.data?.results ?? [];
    return items.slice(0, 20).map((it: any, i: number) => ({
      id: String(it.id ?? i),
      cityFrom: it.from?.city ?? "TLV",
      cityTo: it.to?.city ?? destination,
      price: Number(it.price ?? it.price_total ?? 0)
    }));
  } catch {
    return [];
  }
}
