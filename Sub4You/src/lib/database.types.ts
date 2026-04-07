export interface Profile {
  id: string; // uuid
  first_name: string;
  last_name: string;
  university?: string | null;
  major?: string | null;
  year?: string | null;
  age?: number | null;
  gender?: string | null;
  bio?: string | null;
  instagram_handle?: string | null;
  profile_picture_url?: string | null;
  role?: string | null;
  created_at: string;
  updated_at?: string;
}

export interface SeekerPreference {
  id: string; // uuid
  user_id: string; // uuid
  city?: string | null;
  state?: string | null;
  zipcode?: string | null;
  budget_min?: number | null;
  budget_max?: number | null;
  commute_preference?: string | null;
  max_commute_minutes?: number | null;
  move_in_type?: string | null;
  move_in_date?: string | null;
  lease_duration?: string | null;
  lifestyle_preferences?: any | null; // jsonb
  created_at: string;
  updated_at?: string;
}

export interface PropertyListing {
  id: string; // uuid
  lister_id: string; // uuid
  title: string;
  street_address?: string | null;
  city?: string | null;
  state?: string | null;
  zipcode?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  monthly_rent: number;
  estimated_utilities?: number | null;
  property_type: string;
  bedrooms: number;
  bathrooms: number;
  bathroom_type?: string | null;
  sqft?: number | null;
  gender_preference?: string | null;
  distance_type?: string | null;
  estimated_commute_minutes?: number | null;
  availability_type?: string | null;
  available_from?: string | null;
  available_until?: string | null;
  lease_duration?: string | null;
  description?: string | null;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

export interface ListingImage {
  id: string; // uuid
  listing_id: string; // uuid
  image_url: string;
  order_index?: number | null;
  created_at: string;
}

export interface Amenity {
  id: string; // uuid
  name: string;
}

export interface ListingAmenity {
  listing_id: string; // uuid
  amenity_id: string; // uuid
}

export interface SavedListing {
  id: string; // uuid
  user_id: string; // uuid
  listing_id: string; // uuid
  created_at: string;
}

export interface MatchInvite {
  id: string; // uuid
  listing_id: string; // uuid
  lister_id: string; // uuid
  seeker_id: string; // uuid
  message?: string | null;
  status?: string | null; // pending, accepted, declined
  created_at: string;
}

export interface MessageThread {
  id: string; // uuid
  listing_id: string; // uuid
  seeker_id: string; // uuid
  lister_id: string; // uuid
  created_at: string;
  updated_at?: string;
}

export interface Message {
  id: string; // uuid
  thread_id: string; // uuid
  sender_id: string; // uuid
  content: string;
  created_at: string;
}

// Helper typing for when we join tables via Supabase
export interface JoinedPropertyListing extends PropertyListing {
  profiles?: Profile | null; // the Lister
  listing_images?: ListingImage[];
  listing_amenities?: { amenities: Amenity }[];
}
