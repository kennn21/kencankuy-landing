import { ApiBuilder } from "./api-builder";

export const kencanApi = {
  users: {
    sync: new ApiBuilder("POST", "/users/sync"),
    getProfile: new ApiBuilder("GET", "/users/me"),
    updateProfile: new ApiBuilder("PATCH", "/users/me"),
    linkPartner: new ApiBuilder("POST", "/users/link-partner"),
  },
  datePlan: {
    generate: new ApiBuilder("POST", "/date-plan/generate"),
    getById: new ApiBuilder("GET", "/date-plan/:id"),
    getMyPlans: new ApiBuilder("GET", "/date-plan/my-plans"),
  },
  rateLimit: {
    getStatus: new ApiBuilder("GET", "/rate-limit/status"),
  },
  // Add this new object for the data entry page
  places: {
    getAll: new ApiBuilder("GET", "/curated-places"),
    update: new ApiBuilder("PATCH", "/curated-places/:id"),
  },
};
