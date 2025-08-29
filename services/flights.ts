import axios from 'axios';
import { format } from 'date-fns';

export interface Flight {
  cityFrom: string;
  cityTo: string;
  price: number;
  id: string;
}

const API_URL = 'https://api.travelpayouts.com/v1/prices/cheap';
const TRAVEL_API_KEY = process.env.EXPO_PUBLIC_TRAVEL_API_KEY!;

export async function getFlights(destination: string): Promise<Flight[]> {
  const origin = 'TLV';
  const departMonth = format(new Date(), 'yyyy-MM');

  try {
    console.log('📡 Fetching flights from', origin, 'to:', destination);

    const response = await axios.get(API_URL, {
      params: {
        origin,
        destination,
        depart_date: departMonth,
        return_date: departMonth,
        currency: 'usd',
        token: TRAVEL_API_KEY,
      },
    });

    const flightData = response.data.data[destination];

    if (!flightData) return [];

    const flights: Flight[] = Object.values(flightData).map((flight: any, index: number) => ({
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
