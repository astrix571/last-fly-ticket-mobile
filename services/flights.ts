import { EXPO_PUBLIC_TRAVEL_API_KEY } from '@env';
import axios from 'axios';

export interface Flight {
  cityFrom: string;
  cityTo: string;
  price: number;
  id: string;
}

const API_URL = 'https://travelpayouts-travelpayouts-flight-data-v1.p.rapidapi.com/v2/prices/nearest-places-matrix';

export async function getFlights(destination: string): Promise<Flight[]> {
  const origin = 'TLV';

  try {
    console.log('📡 Fetching flights from', origin, 'to:', destination);

    const response = await axios.get(API_URL, {
      params: {
        origin,
        destination,
        flexibility: 0,
        currency: 'USD',
        limit: 10,
        distance: 100,
      },
      headers: {
        'X-RapidAPI-Key': EXPO_PUBLIC_TRAVEL_API_KEY,
        'X-RapidAPI-Host': 'travelpayouts-travelpayouts-flight-data-v1.p.rapidapi.com',
      },
    });

    const results = response.data.data[destination];

    if (!results) return [];

    const flights: Flight[] = Object.values(results).map((flight: any, index: number) => ({
      id: `flight-${index}`,
      cityFrom: origin,
      cityTo: destination,
      price: flight.price,
    }));

    console.log('✅ Flights received:', flights.length);
    return flights;
  } catch (error: any) {
    console.error('🛑 Error fetching flights:', error.message || error);
    return [];
  }
}
