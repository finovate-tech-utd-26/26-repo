import { api } from "@/lib/apiClient";
import type { AdvertiserOverview, BudgetData, Campaign, SpendPoint } from "@/types/api";

export function getAdvertiserOverview() {
  return api.get<AdvertiserOverview>("/api/advertiser/overview");
}

export function getCampaigns() {
  return api.get<Campaign[]>("/api/advertiser/campaigns");
}

export function getCampaign(id: string) {
  return api.get<Campaign>(`/api/advertiser/campaigns/${id}`);
}

export function createCampaign(input: {
  name: string;
  category: string;
  budget: number;
  dailyCap: number;
  pacing: string;
  creative: { headline: string; cta: string };
}) {
  return api.post<Campaign>("/api/advertiser/campaigns", input);
}

export function updateCampaign(
  id: string,
  input: Partial<{ status: string; budget: number; dailyCap: number }>,
) {
  return api.patch<Campaign>(`/api/advertiser/campaigns/${id}`, input);
}

export function getSpendHistory() {
  return api.get<SpendPoint[]>("/api/advertiser/spend");
}

export function getBudgetData() {
  return api.get<BudgetData>("/api/advertiser/budget");
}
