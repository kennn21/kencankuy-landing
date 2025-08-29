import { ApiBuilder } from "./api-builder";

// Define your API endpoints in a structured object
export const kencanApi = {
  users: {
    sync: new ApiBuilder("POST", "/users/sync"),
    updateProfile: new ApiBuilder("PATCH", "/users/me"),
    linkPartner: new ApiBuilder("POST", "/users/link-partner"),
  },
  datePlan: {
    generate: new ApiBuilder("POST", "/date-plan/generate"),
    getById: new ApiBuilder("GET", "/date-plan/:id"),
  },
  rateLimit: {
    getStatus: new ApiBuilder("GET", "/rate-limit/status"),
  },
};
