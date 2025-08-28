// services/kiwi.ts
import axios, { AxiosError } from 'axios';
import Constants from 'expo-constants';

/**
 * IMPORTANT:
 * make sure you have KIWI_API_KEY in app.config.(js|ts) -> extra.KIWI_API_KEY
 * and .env contains KIWI_API_KEY=XXXX
 * then run: npx expo start --clear
 */

const KIWI_API_KEY = Constants.expoConfig?.extra?.KIWI_API_KEY as string | undefined;
const RAPID_HOST = 'kiwi-com-cheap-flights.p.rapidapi.com';

if (!KIWI_API_KEY || KIWI_API_KEY.trim().length === 0) {
  // Throwing early helps avoid confusing 403s when the key is actually missing.
  console.warn('[kiwi] Missing KIWI_API_KEY from Constants.expoConfig.extra');
}

const kiwiApi = axios.create({
  baseURL: `https://${RAPID_HOST}`,
  headers: {
    'X-RapidAPI-Key': KIWI_API_KEY ?? '',
    'X-RapidAPI-Host': RAPID_HOST,
  },
  timeout: 15000,
});

export type GetFlightsParams = {
  /** origin can be IATA (e.g. "TLV") or "lat-lng" string (e.g. "48.8566-2.3522") */
  origin?: string;
  /** destination IATA (e.g. "ATH") */
  destination: string;
  /** dd/MM/yyyy */
  dateFrom?: string;
  /** dd/MM/yyyy */
  dateTo?: string;
  limit?: number;
  currency?: string;
  locale?: string;
};

/**
 * We try the /round-trip endpoint with a conservative set of params that RapidAPI accepts.
 * If the API rejects origin fields, we still return results filtered by destination.
 */
export async function getFlights({
  origin,
  destination,
  dateFrom,
  dateTo,
  limit = 5,
  currency = 'usd',
  locale = 'en',
}: GetFlightsParams): Promise<any> {
  try {
    // Build params defensively. Some RapidAPI proxies are strict with names.
    const params: Record<string, string | number | boolean> = {
      // Core options (keep them simple & widely accepted by the RapidAPI proxy)
      destination,          // destination IATA (e.g. "ATH")
      currency,             // "usd"
      locale,               // "en"
      limit,                // number of results

      // Dates (optional; many proxies accept these names)
      ...(dateFrom ? { dateFrom } : {}),
      ...(dateTo ? { dateTo } : {}),
    };

    // Try to provide origin in multiple common fields (the proxy will ignore unknowns):
    if (origin) {
      // If it's lat-lng like "48.8566-2.3522"
      const isLatLng = origin.includes('-') || origin.includes(',');
      if (isLatLng) {
        params.sourceCoordinates = origin.replace(',', '-'); // e.g. "48.8566-2.3522"
      } else {
        // Probably IATA like "TLV"
        params.sourceCity = origin;
        params.source = 'city';
      }
    }

    const res = await kiwiApi.get('/round-trip', { params });
    return res.data;
  } catch (err) {
    const ax = err as AxiosError;
    const status = ax.response?.status;
    const body = ax.response?.data;

    console.error(
      `[getFlights] Error ${status ?? ''}`,
      typeof body === 'object' ? JSON.stringify(body) : body
    );

    // Provide a clearer error to the UI:
    if (status === 401 || status === 403) {
      throw new Error(
        'Unauthorized (401/403). Verify RapidAPI subscription, X-RapidAPI-Key, and Host headers.'
      );
    }

    throw new Error(ax.message || 'Unknown error while calling Kiwi API');
  }
}
