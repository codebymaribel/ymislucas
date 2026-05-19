import { Category } from "@/types/dashboard/dates";
import { create } from "zustand";

type DateActions = {
  setActiveCategory: (category: Category) => void;
};
interface DateStore {
  availableCategories: Category[];
  activeCategory: Category;
  actions: DateActions;
}

export const useDateBadgeStore = create<DateStore>((set) => ({
  availableCategories: ["day", "week", "month", "year", "custom"],
  activeCategory: "month",
  actions: {
    setActiveCategory: (category: Category) =>
      set({ activeCategory: category }),
  },
}));
