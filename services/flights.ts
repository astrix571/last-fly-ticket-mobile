export interface Flight {
  cityFrom: string;
  cityTo: string;
  dTime: number;
}

const API_URL = 'https://kiwi-com-cheap-flights.p.rapidapi.com/round-trip';

const headers = {
  'X-RapidAPI-Key': '9f645d5a25msh33ec48fcf2dae40p1f6607jsn54f870fdd02a',
  'X-RapidAPI-Host': 'kiwi-com-cheap-flights.p.rapidapi.com',
};

export async function getFlights(): Promise<Flight[]> {
  const params = new URLSearchParams({
    source: 'country%3AUS',
    destination: 'city%3Adubrovnik_hr',
    currency: 'usd',
    locale: 'en',
    adults: '1',
    children: '0',
    infants: '0',
    bags: '1',
    cabinClass: 'ECONOMY',
    sortBy: 'QUALITY',
    sortOrder: 'ASC',
    limit: '10',
  });

  try {
    const response = await fetch(`${API_URL}?${params.toString()}`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data.flights || [];
  } catch (error) {
    console.error('Error fetching flights:', error);
    return [];
  }
}
