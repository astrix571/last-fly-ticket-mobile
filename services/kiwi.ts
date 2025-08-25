// services/kiwi.ts
export type RoundTripParams = {
    source: string;
    destination: string;
    currency?: string;
    locale?: string;
    adults?: number;
    children?: number;
    infants?: number;
    handbags?: number;
    holdbags?: number;
    cabinClass?: "ECONOMY" | "PREMIUM_ECONOMY" | "BUSINESS" | "FIRST";
    limit?: number;
  };
  
  const RAPIDAPI_HOST = "kiwi-com-cheap-flights.p.rapidapi.com";
  const RAPIDAPI_KEY = "9f645d5a25msh33ec48fcf2dae40p1f6607jsn548f70fdd02a";
  
  function buildQuery(p: RoundTripParams): string {
    const params = new URLSearchParams({
      source: p.source,
      destination: p.destination,
      currency: p.currency ?? "usd",
      locale: p.locale ?? "en",
      adults: String(p.adults ?? 1),
      children: String(p.children ?? 0),
      infants: String(p.infants ?? 0),
      handbags: String(p.handbags ?? 1),
      holdbags: String(p.holdbags ?? 0),
      cabinClass: p.cabinClass ?? "ECONOMY",
      sortby: "QUALITY",
      sortorder: "ASC",
      onlyWizzClasses: "true",
      allowReturnFromDifferentCity: "true",
      allowChangeInboundDestination: "true",
      allowChangeInboundSource: "true",
      allowDifferentStationConnection: "true",
      enableUseSelfTransfer: "true",
      allowOvernightStopover: "true",
      enableTrueHiddenCity: "true",
      enableThrowawayTicketing: "true",
      limit: String(p.limit ?? 20),
    });
  
    return params.toString();
  }
  
  export async function getRoundTrip(p: RoundTripParams, timeoutMs = 20000) {
    const url = `https://${RAPIDAPI_HOST}/round-trip?${buildQuery(p)}`;
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeoutMs);
  
    try {
      const res = await fetch(url, {
        method: "GET",
        headers: {
          "x-rapidapi-host": RAPIDAPI_HOST,
          "x-rapidapi-key": RAPIDAPI_KEY,
        },
        signal: controller.signal,
      });
  
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`HTTP ${res.status} – ${res.statusText} ${text ? `| ${text}` : ""}`);
      }
  
      return await res.json();
    } finally {
      clearTimeout(id);
    }
  }
  