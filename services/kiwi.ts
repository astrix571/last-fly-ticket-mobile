import axios from 'axios';
import Constants from 'expo-constants';

const RAPIDAPI_KEY = Constants.expoConfig?.extra?.RAPIDAPI_KEY;

export async function getFlights(params: {
  origin: string;
  destination: string;
  dateFrom: string;
  dateTo: string;
  limit: number;
}) {
  const { origin, destination, dateFrom, dateTo, limit } = params;

  try {
    const response = await axios.get('https://kiwi-flights.p.rapidapi.com/flights', {
      params: {
        fly_from: origin,
        fly_to: destination,
        date_from: dateFrom,
        date_to: dateTo,
        limit,
      },
      headers: {
        'X-RapidAPI-Key': RAPIDAPI_KEY,
        'X-RapidAPI-Host': 'kiwi-flights.p.rapidapi.com',
      },
    });

    console.log('✅ Real API response:', response.data);
    return { data: response.data.data || [] };
  } catch (error) {
    console.error('🛑 Error calling Kiwi via RapidAPI:', error);
    return { data: [] };
  }
}
