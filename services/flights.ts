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
        distance: 100,
        limit: 10,
        currency: 'USD',
        flexibility: 0,
        show_to_affiliates: true,
      },
      headers: {
        'X-RapidAPI-Key': process.env.EXPO_PUBLIC_TRAVEL_API_KEY,
        'X-RapidAPI-Host': 'travelpayouts-travelpayouts-flight-data-v1.p.rapidapi.com',
      },
    });

    const data = response.data.data;
    if (!data || !data[destination]) return [];

    const flights: Flight[] = Object.entries(data[destination]).map(
      ([, flight]: [string, any], index: number) => ({
        id: `flight-${index}`,
        cityFrom: origin,
        cityTo: destination,
        price: flight.price,
      })
    );

    console.log('✅ Flights received:', flights.length);
    return flights;
  } catch (error: any) {
    console.error('🛑 Error fetching flights:', error.response?.status, error.message);
    return [];
  }
}
