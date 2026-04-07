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

export async function getListerProperties(listerId: string): Promise<JoinedPropertyListing[]> {
  try {
    const { data, error } = await supabase
      .from('property_listings')
      .select(`
        *,
        profiles (*),
        listing_images (*),
        listing_amenities ( amenities (*) )
      `)
      .eq('lister_id', listerId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []) as JoinedPropertyListing[];
  } catch (error) {
    console.error('Unexpected error in getListerProperties:', error);
    return [];
  }
}

export async function deleteListing(listingId: number) {
  try {
    const { error } = await supabase.from('property_listings').delete().eq('id', listingId);
    if (error) throw error;
    return true;
  } catch (err) {
    console.error('Error deleting listing:', err);
    return false;
  }
}

export async function uploadListing(userId: string, formData: any, photoFiles: File[], selectedAmenities: string[]) {
  try {
    // 1. Insert into property_listings
    const { data: listing, error: listingError } = await supabase
      .from('property_listings')
      .insert({
        lister_id: userId,
        title: formData.listingTitle,
        street_address: formData.address,
        city: formData.city,
        state: formData.stateCode,
        zipcode: formData.zipcode,
        monthly_rent: parseFloat(formData.rent),
        estimated_utilities: parseFloat(formData.utilities) || 0,
        property_type: formData.propertyType,
        bedrooms: parseFloat(formData.beds),
        bathrooms: parseFloat(formData.baths),
        bathroom_type: formData.bathroomType || null,
        sqft: parseFloat(formData.sqft) || null,
        gender_preference: formData.genderPref || null,
        distance_type: formData.commuteType,
        estimated_commute_minutes: parseInt(formData.commuteMinutes) || null,
        availability_type: formData.moveInType,
        available_from: formData.moveInDate || null,
        available_until: formData.moveOutDate || null,
        lease_duration: formData.leaseDuration || null,
        description: formData.description,
        is_active: true
      })
      .select()
      .single();

    if (listingError) throw listingError;

    const listingId = listing.id;

    // 2. Upload images to Supabase Storage 'listing-images' bucket
    const imageUrls: string[] = [];
    for (let i = 0; i < photoFiles.length; i++) {
      const file = photoFiles[i];
      const fileExt = file.name.split('.').pop() || 'jpeg';
      const fileName = `${userId}/${listingId}/${Date.now()}-${i}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('listing-images')
        .upload(fileName, file);
        
      if (uploadError) {
        console.error('Image upload failed:', uploadError);
        continue;
      }
      
      const { data: publicUrlData } = supabase.storage
        .from('listing-images')
        .getPublicUrl(fileName);
        
      imageUrls.push(publicUrlData.publicUrl);
    }

    // 3. Insert into listing_images
    if (imageUrls.length > 0) {
      const imageRows = imageUrls.map((url, i) => ({
        listing_id: listingId,
        image_url: url,
        order_index: i
      }));
      await supabase.from('listing_images').insert(imageRows);
    }

    // 4. Handle Amenities (Assume amenities table is pre-populated, so we fetch by name)
    if (selectedAmenities.length > 0) {
      const { data: amenityData } = await supabase
        .from('amenities')
        .select('id, name')
        .in('name', selectedAmenities);

      if (amenityData && amenityData.length > 0) {
        const amenityRows = amenityData.map(a => ({
          listing_id: listingId,
          amenity_id: a.id
        }));
        await supabase.from('listing_amenities').insert(amenityRows);
      }
    }

    return listing;
  } catch (err) {
    console.error("API Error in uploadListing:", err);
    throw err;
  }
}
