// services/kiwi.ts
import axios from 'axios';

const KIWI_API_KEY = '9f645d5a25msh33ec48fcf2dae40p1f6607jsn548f70fdd02a'; // 🔐 החלף את המפתח אם תעבור לסביבת PROD

const kiwiApi = axios.create({
  baseURL: 'https://kiwi-com-cheap-flights.p.rapidapi.com',
  headers: {
    'X-RapidAPI-Key': KIWI_API_KEY,
    'X-RapidAPI-Host': 'kiwi-com-cheap-flights.p.rapidapi.com',
  },
});

interface FlightParams {
  flyFrom: string;
  flyTo: string;
  dateFrom: string; // format: "28/08/2025"
  dateTo: string;   // format: "30/08/2025"
}

export async function getFlights({ flyFrom, flyTo, dateFrom, dateTo }: FlightParams) {
  try {
    const response = await kiwiApi.get('/round-trip', {
      params: {
        source: 'country',
        destinationCity: flyTo,
        sourceCity: flyFrom,
        dateFrom,
        dateTo,
        currency: 'usd',
        locale: 'en',
        adults: 1,
        children: 0,
        infants: 0,
        sortBy: 'quality',
        limit: 5,
      },
    });

    return response.data;
  } catch (error) {
    console.error('[getFlights] Error:', error);
    return null;
  }
}
