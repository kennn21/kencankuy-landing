export type FullPlace = {
  id: number;
  googlePlaceId: string;
  name: string;
  address: string | null;
  photoReference: string | null;
  cachedPhotoUrl: string | null;
  latitude: number;
  longitude: number;
  category: string; // e.g., "ROMANTIC", "FOODIE"
  activityType: string | null; // e.g., "DINNER"
  needsPhotoProcessing: boolean;
  createdAt: string; // Dates are sent as strings in JSON
  updatedAt: string;
  extension: {
    id: number;
    priceMin: number | null;
    priceMax: number | null;
    boostedRate: number;
    placeId: number;
  } | null;
};
