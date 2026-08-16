export const businessCategories = [
  "Outdoor & Recreation",
  "Food & Dining",
  "Home & Garden",
  "Local News",
  "Technology",
];

const relatedCategories: Record<string, string[]> = {
  "Outdoor & Recreation": ["Outdoor & Recreation", "Product Reviews", "Sporting Goods"],
  "Food & Dining": ["Food & Dining", "Local News", "Community Events"],
  "Home & Garden": ["Home & Garden", "DIY", "Local Services"],
  "Local News": ["Local News", "Community Events", "Local Services"],
  Technology: ["Technology", "Product Reviews", "Business & Productivity"],
};

export function predictCategories(category: string): string[] {
  return relatedCategories[category] ?? ["General Audience"];
}
