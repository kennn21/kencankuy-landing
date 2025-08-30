export type DatePlace = {
  id: number;
  name: string;
  address: string;
  googlePlaceId: string;
  photoReference: string | null;
  cachedPhotoUrl?: string | null;
  latitude: number;
  longitude: number;
};

export type DateStep = {
  id: number;
  datePlanId: number;
  stepNumber: number;
  placeId: number;
  place: DatePlace;
};

export type DatePlan = {
  id: number;
  steps: DateStep[];
  userId: string | null;
  theme: string;
  createdAt: string;
  updatedAt: string;
};
