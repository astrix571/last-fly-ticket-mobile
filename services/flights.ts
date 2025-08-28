import axios from 'axios';
import { format } from 'date-fns';

export interface Flight {
  cityFrom: string;
  cityTo: string;
  price: number;
  airline: string;
  departure: string;
  id: string;
}

const API_URL =
  'https://travelpayouts-travelpayouts-flight-data-v1.p.rapidapi.com/v2/prices/nearest-places-matrix';

const headers = {
  'X-RapidAPI-Key': process.env.TRAVEL_API_KEY || '',
  'X-RapidAPI-Host': 'travelpayouts-travelpayouts-flight-data-v1.p.rapidapi.com',
};

export async function getFlights(destination: string): Promise<Flight[]> {
  const origin = 'TLV';
  const currency = 'usd';
  const departureDate = format(
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    'yyyy-MM-dd'
  );

  try {
    console.log('📡 Fetching flights from', origin, 'to:', destination);

    const response = await axios.get(API_URL, {
      params: {
        origin,
        destination,
        currency,
        departure_at: departureDate,
        distance: '200',
        limit: '5',
      },
      headers,
    });

    const data = response.data.data || [];

    const flights: Flight[] = data.map((flight: any, index: number) => ({
      id: `flight-${index}-${flight.value}`,
      cityFrom: origin,
      cityTo: destination,
      price: flight.value,
      airline: flight.airline || 'Unknown',
      departure: flight.departure_at || '',
    }));

    console.log('✅ Flights received:', flights.length);
    return flights;
  } catch (error: any) {
    console.error('🛑 Error calling Travelpayouts API:', error);
    return [];
  }
}
