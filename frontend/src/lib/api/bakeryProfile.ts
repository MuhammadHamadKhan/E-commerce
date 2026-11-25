// Bakery owner profile endpoints (need login).
import { get, put } from "./client";
import type { ProfileResponse } from "./types";

// GET /api/bakery/profile - my bakery details
export function getMyProfile() {
  return get<ProfileResponse>("/bakery/profile");
}

// PUT /api/bakery/profile - all four fields are required by the backend
export interface ProfileInput {
  name: string;
  address: string;
  city: string;
  phone: string;
}

export function updateMyProfile(data: ProfileInput) {
  return put<ProfileResponse>("/bakery/profile", data);
}
