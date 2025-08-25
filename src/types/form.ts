export type PlaceCategory = {
  icon: string;
  label: string;
  value: PlaceCategoryEnum;
};

export enum PlaceCategoryEnum {
  ROMANTIC = "romantic",
  ARTSY = "artsy",
  FOODIE = "foodie",
  ADVENTUROUS = "adventurous",
  RELAXING = "relaxing",
  SPORTY = "sporty",
  ENTERTAINMENT = "entertainment",
}
