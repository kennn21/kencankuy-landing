import { PlaceCategory, PlaceCategoryEnum } from "@/types/form";

export const PLACE_CATEGORIES: PlaceCategory[] = [
  {
    icon: "Heart",
    label: "Romantic",
    value: PlaceCategoryEnum["ROMANTIC"],
  },
  {
    icon: "LineSquiggle",
    label: "Adventurous",
    value: PlaceCategoryEnum["ADVENTUROUS"],
  },
  {
    icon: "Palette",
    label: "Artsy",
    value: PlaceCategoryEnum["ARTSY"],
  },
  {
    icon: "Tv",
    label: "Entertainment",
    value: PlaceCategoryEnum["ENTERTAINMENT"],
  },
  {
    icon: "Beef",
    label: "Foodie",
    value: PlaceCategoryEnum["FOODIE"],
  },
  {
    icon: "Bubbles",
    label: "Relaxing",
    value: PlaceCategoryEnum["RELAXING"],
  },
  {
    icon: "Bike",
    label: "Sporty",
    value: PlaceCategoryEnum["SPORTY"],
  },
];
