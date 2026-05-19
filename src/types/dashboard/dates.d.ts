export type FixedCategories = "day" | "week" | "month" | "year" | "custom";
export type DynamicCategory = `custom_${string}`;
export type Category = FixedCategories | DynamicCategory;
