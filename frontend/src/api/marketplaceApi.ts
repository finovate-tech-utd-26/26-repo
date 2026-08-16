import { API_BASE_URL, api } from "@/lib/apiClient";
import type { TickerEvent } from "@/types/api";

export function streamAuctionEvents(onEvent: (event: TickerEvent) => void): EventSource {
  const source = new EventSource(`${API_BASE_URL}/api/marketplace/events/stream`);
  source.addEventListener("event", (e) => {
    onEvent(JSON.parse((e as MessageEvent).data));
  });
  return source;
}

export function simulateVisitor(siteId?: string) {
  return api.post<TickerEvent>("/api/marketplace/events/simulate", siteId ? { siteId } : undefined);
}
