// services/kiwi.ts
import axios from 'axios';

export async function getFlights(params: {
  origin: string;
  destination: string;
  dateFrom: string;
  dateTo: string;
  limit: number;
}) {
  const { origin, destination, dateFrom, dateTo, limit } = params;

  // הזן כאן את המפתח שלך אם יש
  const API_KEY = 'YOUR_KIWI_API_KEY';
  const url = 'https://api.tequila.kiwi.com/v2/search';

  try {
    const response = await axios.get(url, {
      headers: { apikey: API_KEY },
      params: {
        fly_from: origin,
        fly_to: destination,
        dateFrom,
        dateTo,
        limit,
        one_for_city: 0,
        partner: 'picky',
      },
    });
    console.log('Kiwi raw response:', response.data);

    if (response.data && response.data.data?.length > 0) {
      return { data: response.data.data };
    } else {
      console.warn('⚠️ No flights found — returning mock data');
    }
  } catch (error) {
    console.error('🛑 Error calling Kiwi API:', error);
  }

  // Mock fallback (לבדיקה)
  return {
    data: [
      {
        id: 'mock-1',
        cityFrom: origin,
        cityTo: destination,
        price: 999,
        route: [{ airline: 'MOCK', local_departure: '2025-09-01T00:00:00.000Z' }],
      },
      {
        id: 'mock-2',
        cityFrom: origin,
        cityTo: destination,
        price: 799,
        route: [{ airline: 'MOCK2', local_departure: '2025-09-02T00:00:00.000Z' }],
      },
    ],
  };
}
