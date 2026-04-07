import { supabase } from './supabase';
import type { JoinedPropertyListing } from './database.types';

/**
 * Fetches all active property listings from Supabase,
 * including their images, amenities, and host profile details.
 */
export async function getProperties(): Promise<JoinedPropertyListing[]> {
  try {
    const { data, error } = await supabase
      .from('property_listings')
      .select(`
        *,
        profiles (*),
        listing_images (*),
        listing_amenities ( amenities (*) )
      `)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('API Error fetching properties:', error);
      throw error;
    }

    return (data || []) as JoinedPropertyListing[];
  } catch (error) {
    console.error('Unexpected error in getProperties:', error);
    return [];
  }
}
