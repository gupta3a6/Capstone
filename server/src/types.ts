export type Role = "sublessor" | "sublease";

export interface User {
  id: number;
  email: string;
  passwordHash: string;
  fullName: string;
  role: Role | null; // can choose later
  createdAt: string; // ISO
}

export interface Listing {
  id: number;
  ownerUserId: number; // sublessor
  title: string;
  description: string;
  city: string;
  monthlyRent: number;
  bedrooms: number;
  bathrooms: number;
  startDate: string; // ISO
  endDate: string; // ISO
  amenities: string; // comma-separated for simplicity
  createdAt: string;
}

export interface Preferences {
  id: number;
  userId: number; // sublease seeker
  minBedrooms: number | null;
  maxRent: number | null;
  desiredCity: string | null;
  earliestStart: string | null;
  latestEnd: string | null;
  amenities: string | null; // comma-separated preferred
  updatedAt: string;
}

export interface JwtUser {
  id: number;
  email: string;
}
