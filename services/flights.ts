// services/flights.ts

export type Flight = {
  id: string;
  from: string;
  to: string;
  date: string;
};

export const getFlights = async (): Promise<Flight[]> => {
  try {
    const res = await fetch('https://mocki.io/v1/564e1ff3-d957-4a4d-b7ba-ecc22b7f97b1');
    if (!res.ok) throw new Error('Failed to fetch flights');
    return await res.json();
  } catch (error) {
    console.error('Error fetching flights:', error);
    return [];
  }
};
