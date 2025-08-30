import axios from 'axios';
import { format } from 'date-fns';

const TRAVEL_API_KEY = process.env.EXPO_PUBLIC_TRAVEL_API_KEY!;
const API_URL = 'https://api.travelpayouts.com/v1/prices/cheap';

export interface Flight {
  cityFrom: string;
  cityTo: string;
  price: number;
  id: string;
}

export async function getFlights(destination: string): Promise<Flight[]> {
  const origin = 'TLV';
  const departMonth = format(new Date(), 'yyyy-MM');

  try {
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

    const data = response.data.data[destination];
    if (!data) return [];

    return Object.values(data).map((flight: any, index: number) => ({
      id: `flight-${index}`,
      cityFrom: origin,
      cityTo: destination,
      price: flight.price,
    }));
  } catch (error: any) {
    console.error('Error fetching flights:', error.message || error);
    return [];
  }
}
