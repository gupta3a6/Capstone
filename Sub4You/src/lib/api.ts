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

export async function getSeekers() {
  try {
    // Inner join profiles that have a seeker_preferences row
    const { data, error } = await supabase
      .from('seeker_preferences')
      .select(`
        *,
        profiles!inner (*)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data.map((sp: any) => ({
      id: sp.profiles.id,
      name: `${sp.profiles.first_name} ${sp.profiles.last_name}`,
      age: sp.profiles.age,
      gender: sp.profiles.gender,
      university: sp.profiles.university,
      major: sp.profiles.major,
      year: sp.profiles.academic_year,
      bio: sp.profiles.bio,
      instagram: sp.profiles.instagram,
      avatar: sp.profiles.avatar_url,
      minBudget: sp.budget_min,
      maxBudget: sp.budget_max,
      city: sp.target_city,
      state: sp.target_state,
      zipcode: sp.target_zip,
      moveInDate: sp.move_in_date,
      moveOutDate: sp.move_out_date,
      lifestyle: sp.lifestyle_preferences || []
    }));
  } catch (error) {
    console.error('Error in getSeekers:', error);
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
    let fromDate = formData.moveInDate;
    let untilDate = formData.moveOutDate;

    // Gracefully handle 'semester' selections by mapping them to real Dates for the Supabase DATE column
    if (formData.moveInType === 'semester' && formData.moveInSemesters?.length > 0) {
      const sems = formData.moveInSemesters;
      if (sems.includes('Fall 2026')) { fromDate = '2026-08-01'; untilDate = '2026-12-15'; }
      else if (sems.includes('Spring 2027')) { fromDate = '2027-01-01'; untilDate = '2027-05-15'; }
      else if (sems.includes('Summer 2027')) { fromDate = '2027-05-15'; untilDate = '2027-08-01'; }
      else if (sems.includes('Fall 2027')) { fromDate = '2027-08-01'; untilDate = '2027-12-15'; }
    }

    // Safety fallback for NOT NULL Database Constraint
    if (!fromDate) fromDate = new Date().toISOString().split('T')[0];
    if (!untilDate) untilDate = new Date().toISOString().split('T')[0];

    // 0. IMPORTANT PHASE 4 HOTFIX: Ensure Profile exists to prevent Foreign Key constraint violations!
    // (Until Phase 5 connects real profile generation)
    const { data: profileCheck } = await supabase.from('profiles').select('id').eq('id', userId).single();
    if (!profileCheck) {
         await supabase.from('profiles').insert({
             id: userId,
             first_name: 'Test',
             last_name: 'User',
             university: 'University of Cincinnati'
         });
    }

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
        available_from: fromDate,
        available_until: untilDate,
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

export async function uploadAvatar(userId: string, photoFile: File | null) {
  if (!photoFile) return null;
  try {
    const fileExt = photoFile.name.split('.').pop() || 'jpeg';
    const fileName = `${userId}-avatar-${Date.now()}.${fileExt}`;
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(fileName, photoFile);
    if (uploadError) throw uploadError;
    
    const { data: publicUrlData } = supabase.storage.from('avatars').getPublicUrl(fileName);
    return publicUrlData.publicUrl;
  } catch (err) {
    console.error('Avatar Upload Error:', err);
    return null;
  }
}

export async function updateSeekerProfile(userId: string, profileData: any, photoFile: File | null) {
  try {
    // 1. Upload Avatar
    let avatarUrl = profileData.photoPreview;
    
    // Safety check: Never pass raw Base64 data strings into Postgres (causes 413 Payload Too Large)
    if (avatarUrl && avatarUrl.startsWith('data:')) {
       avatarUrl = null; 
    }
    
    if (photoFile) {
        const url = await uploadAvatar(userId, photoFile);
        if (url) avatarUrl = url;
    }
    
    // 2. Safely Update generic 'profiles' schema
    const { error: pErr } = await supabase.from('profiles').update({
      avatar_url: avatarUrl,
      age: parseInt(profileData.age) || null,
      gender: profileData.gender,
      university: profileData.university,
      major: profileData.major,
      academic_year: profileData.year,
      bio: profileData.bio,
      instagram: profileData.instagram,
      setup_complete: true
    }).eq('id', userId);
    if (pErr) throw pErr;

    // 3. Map Dates safely for NOT NULL constraints
    let fromDate = profileData.moveInDate;
    let untilDate = profileData.moveOutDate;

    if (profileData.moveInType === 'semester' && profileData.moveInSemesters?.length > 0) {
      const sems = profileData.moveInSemesters;
      if (sems.includes('Fall 2026')) { fromDate = '2026-08-01'; untilDate = '2026-12-15'; }
      else if (sems.includes('Spring 2027')) { fromDate = '2027-01-01'; untilDate = '2027-05-15'; }
      else if (sems.includes('Summer 2027')) { fromDate = '2027-05-15'; untilDate = '2027-08-01'; }
      else if (sems.includes('Fall 2027')) { fromDate = '2027-08-01'; untilDate = '2027-12-15'; }
    }
    if (!fromDate) fromDate = new Date().toISOString().split('T')[0];
    if (!untilDate) untilDate = new Date().toISOString().split('T')[0];

    // 4. Upsert implicit 'seeker_preferences' schema
    const { error: sErr } = await supabase.from('seeker_preferences').upsert({
      user_id: userId,
      budget_min: profileData.minBudget,
      budget_max: profileData.maxBudget,
      city: profileData.city,
      state: profileData.state,
      move_in_date: fromDate,
      move_out_date: untilDate,
      lifestyle_preferences: profileData.lifestyle || []
    }, { onConflict: 'user_id' });
    
    if (sErr) throw sErr;
    return true;
  } catch (err) {
    console.error('Error updating seeker profile:', err);
    throw err;
  }
}

export async function updateListerProfile(userId: string, profileData: any, photoFile: File | null) {
  try {
    let avatarUrl = profileData.photoPreview; 
    
    // Safety check: Never pass raw Base64 data strings into Postgres
    if (avatarUrl && avatarUrl.startsWith('data:')) {
       avatarUrl = null; 
    }
    
    if (photoFile) {
        const url = await uploadAvatar(userId, photoFile);
        if (url) avatarUrl = url;
    }
    
    const { error: pErr } = await supabase.from('profiles').update({
      avatar_url: avatarUrl,
      age: parseInt(profileData.age) || null,
      gender: profileData.gender,
      university: profileData.university,
      major: profileData.major,
      academic_year: profileData.year,
      bio: profileData.bio,
      instagram: profileData.instagram,
      setup_complete: true
    }).eq('id', userId);
    
    if (pErr) throw pErr;
    return true;
  } catch (err) {
    console.error('Error updating lister profile:', err);
    throw err;
  }
}

export async function sendMatchRequest(listerId: string, seekerId: string) {
  try {
    // Phase 6 prototype: dynamically grab the lister's first active property as the "context"
    const { data: props, error: propsErr } = await supabase
      .from('property_listings')
      .select('id')
      .eq('lister_id', listerId)
      .limit(1);
      
    if (propsErr || !props || props.length === 0) throw new Error("Lister has no active properties to match with.");

    const { error } = await supabase.from('match_requests').insert({
      initiating_lister_id: listerId,
      listing_context_id: props[0].id,
      target_seeker_id: seekerId,
      status: 'pending'
    });
    
    // Ignore unique constraint violations gracefully
    if (error && error.code !== '23505') throw error;
    return true;
  } catch (err) {
    console.error('API Error sending match request:', err);
    throw err;
  }
}

export async function getSeekerIncomingMatches(seekerId: string) {
  try {
    const { data, error } = await supabase
      .from('match_requests')
      .select(`
        id,
        status,
        created_at,
        property_listings (
          id, title, monthly_rent, city, state_code,
          listing_images(image_url)
        ),
        profiles!match_requests_initiating_lister_id_fkey (
          id, first_name, last_name, avatar_url, university
        )
      `)
      .eq('target_seeker_id', seekerId);

    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error('API Error fetching match requests:', err);
    return [];
  }
}

export async function updateMatchRequestStatus(matchRequestId: string, newStatus: 'accepted' | 'declined') {
  try {
    const { data, error } = await supabase.from('match_requests')
      .update({ status: newStatus })
      .eq('id', matchRequestId)
      .select()
      .single();
      
    if (error) throw error;
    return data;
  } catch (err) {
    console.error('API Error updating match request:', err);
    throw err;
  }
}

export async function getOrCreateMessageThread(listingId: string, seekerId: string, listerId: string) {
  try {
    const { data: existing, error: findErr } = await supabase
      .from('message_threads')
      .select('id')
      .eq('listing_id', listingId)
      .eq('seeker_id', seekerId)
      .single();
      
    if (existing) return existing.id;
    
    // Ignore error if 0 rows returned from single check
    const { data: newThread, error: createErr } = await supabase
      .from('message_threads')
      .insert({ listing_id: listingId, seeker_id: seekerId, lister_id: listerId })
      .select('id')
      .single();
      
    if (createErr) throw createErr;
    return newThread.id;
  } catch (err) {
    console.error('Error getOrCreateMessageThread:', err);
    throw err;
  }
}

export async function getUserThreads(userId: string) {
  try {
    const { data, error } = await supabase
      .from('message_threads')
      .select(`
        id,
        listing_id,
        seeker_id,
        lister_id,
        created_at,
        property_listings ( id, title, monthly_rent, city, listing_images(image_url), available_from ),
        seeker_profile:profiles!message_threads_seeker_id_fkey ( id, first_name, last_name, avatar_url, bio, university ),
        lister_profile:profiles!message_threads_lister_id_fkey ( id, first_name, last_name, avatar_url, bio, university )
      `)
      .or(`seeker_id.eq.${userId},lister_id.eq.${userId}`)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error('Error fetching threads:', err);
    return [];
  }
}

export async function getThreadMessages(threadId: string) {
  try {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('thread_id', threadId)
      .order('created_at', { ascending: true });
      
    if (error) throw error;
    return data || [];
  } catch(err) {
    console.error('Error fetching thread messages:', err);
    return [];
  }
}

export async function sendMessage(threadId: string, senderId: string, content: string) {
  try {
    const { error } = await supabase
      .from('messages')
      .insert({ thread_id: threadId, sender_id: senderId, content });
    if (error) throw error;
    return true;
  } catch (err) {
    console.error('Error sending message:', err);
    throw err;
  }
}
