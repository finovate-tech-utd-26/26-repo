export type Role = "publisher" | "advertiser";

export interface UserProfile {
  id: string;
  email: string;
  role: Role;
  businessName: string | null;
  category: string | null;
  advertiserGoal: string | null;
  monthlyBudgetRange: number | null;
  notifyOnActivity: boolean;
  notifyOnRecommendations: boolean;
}

export interface AuthResponse {
  token: string;
  role: Role;
}

export interface AdSlot {
  id: string;
  name: string;
  position: "banner" | "sidebar" | "in-content" | "footer";
  enabled: boolean;
}

export interface Site {
  id: string;
  name: string;
  url: string;
  status: "active" | "paused";
  category: string;
  adsShownAvg: number;
  revenue: number;
  maxAdsPerSession: number;
  categories: string[];
  slots: AdSlot[];
  connectedDate: string;
  embedSnippet: string;
}

export interface RevenuePoint {
  [key: string]: string | number;
  date: string;
  revenue: number;
  revenueWithoutSignal: number;
  adsShown: number;
}

export interface ActivityItem {
  id: string;
  text: string;
  time: string;
}

export interface PublisherOverview {
  revenueThisMonth: number;
  adsShownAvg: number;
  revenuePerAdShown: number;
  bounceRate: number;
  sitesConnected: number;
  sitesActive: number;
  sites: Site[];
  activity: ActivityItem[];
}

export interface Recommendation {
  id: string;
  action: string;
  confidence: number;
  projectedCpm: number;
  rationale: string;
  tone: string;
  createdAt: string;
}

export interface Creative {
  headline: string;
  cta: string;
  color: string;
}

export interface Campaign {
  id: string;
  name: string;
  status: "active" | "paused" | "ended";
  category: string;
  budget: number;
  dailyCap: number;
  spend: number;
  conversions: number;
  cpa: number;
  pacing: "even" | "accelerated";
  bidStrategy: string;
  targeting: string[];
  creative: Creative;
  createdDate: string;
}

export interface SpendPoint {
  [key: string]: string | number;
  date: string;
  spend: number;
  spendNaive: number;
}

export interface AdvertiserOverview {
  totalSpend: number;
  conversions: number;
  costPerConversion: number;
  estSavings: number;
  campaigns: Campaign[];
}

export interface PacingDay {
  [key: string]: string | number;
  day: string;
  even: number;
  naive: number;
}

export interface ReachItem {
  [key: string]: string | number;
  category: string;
  value: number;
}

export interface BudgetAllocationItem {
  name: string;
  value: number;
  color: string;
}

export interface RecommendationItem {
  id: string;
  text: string;
  tone: "warning" | "info" | "success";
}

export interface BudgetData {
  pacingByDay: PacingDay[];
  reachBreakdown: ReachItem[];
  budgetAllocation: BudgetAllocationItem[];
  recommendations: RecommendationItem[];
}

export interface TickerEvent {
  id: string;
  timestamp: number;
  kind: "match" | "embedding" | "auction";
  text: string;
}
