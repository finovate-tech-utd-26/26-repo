import { api } from "@/lib/apiClient";
import type { PublisherOverview, Recommendation, RevenuePoint, Site } from "@/types/api";

export function getPublisherOverview() {
  return api.get<PublisherOverview>("/api/publisher/overview");
}

export function getSites() {
  return api.get<Site[]>("/api/publisher/sites");
}

export function getSite(siteId: string) {
  return api.get<Site>(`/api/publisher/sites/${siteId}`);
}

export function createSite(input: { name: string; url: string; category: string }) {
  return api.post<Site>("/api/publisher/sites", input);
}

export function updateSite(
  siteId: string,
  input: Partial<{ status: string; maxAdsPerSession: number; category: string }>,
) {
  return api.patch<Site>(`/api/publisher/sites/${siteId}`, input);
}

export function updateSlot(siteId: string, slotId: string, enabled: boolean) {
  return api.patch<Site>(`/api/publisher/sites/${siteId}/slots/${slotId}`, { enabled });
}

export function getSiteRevenue(siteId: string) {
  return api.get<RevenuePoint[]>(`/api/publisher/sites/${siteId}/revenue`);
}

export function getRevenueHistory() {
  return api.get<RevenuePoint[]>("/api/publisher/revenue");
}

export function getRecommendation(siteId: string) {
  return api.get<Recommendation>(`/api/publisher/sites/${siteId}/recommendations`);
}
