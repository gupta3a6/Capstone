import db from "./db";

interface MatchInput {
  userId?: number; // for sublease seeker -> find listings
  listingId?: number; // for sublessor -> find users
}

function scoreAmenities(preferred: string | null, actual: string): number {
  if (!preferred) return 0.1; // slight base
  const pref = preferred
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  const act = actual
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  const matches = pref.filter((a) => act.includes(a)).length;
  return pref.length === 0 ? 0.1 : matches / pref.length;
}

export function findTopListingsForUser(userId: number, limit = 10) {
  const pref: any = db.prepare("SELECT * FROM preferences WHERE user_id = ?").get(userId) as any;
  const listings: any[] = db.prepare("SELECT * FROM listings").all() as any[];

  const scored: Array<{ listing: any; score: number }> = listings.map((l: any) => {
    let score = 0;
    if (pref) {
      if (pref.min_bedrooms != null) {
        score += l.bedrooms >= pref.min_bedrooms ? 1 : -1;
      }
      if (pref.max_rent != null) {
        score += l.monthly_rent <= pref.max_rent ? 1 : -1;
      }
      if (pref.desired_city) {
        score += l.city.toLowerCase() === pref.desired_city.toLowerCase() ? 1 : 0;
      }
      if (pref.earliest_start && pref.latest_end) {
        const sOk = new Date(l.start_date) >= new Date(pref.earliest_start);
        const eOk = new Date(l.end_date) <= new Date(pref.latest_end);
        score += sOk && eOk ? 1 : -0.5;
      }
      score += scoreAmenities(pref.amenities, l.amenities);
    }
    // recency bonus
    const ageDays = (Date.now() - new Date(l.created_at).getTime()) / 86400000;
    score += Math.max(0, 1 - ageDays / 30);

    return { listing: l, score };
  });

  return scored
    .sort((a: { listing: any; score: number }, b: { listing: any; score: number }) => b.score - a.score)
    .slice(0, limit)
    .map((x: { listing: any; score: number }) => x.listing);
}

export function findTopUsersForListing(listingId: number, limit = 10) {
  const listing: any = db.prepare("SELECT * FROM listings WHERE id = ?").get(listingId) as any;
  if (!listing) return [];
  const users: any[] = db.prepare("SELECT * FROM users").all() as any[];
  const prefs: any[] = db.prepare("SELECT * FROM preferences").all() as any[];
  const userIdToPref: Record<number, any> = {};
  for (const p of prefs) userIdToPref[p.user_id] = p;

  const scored: Array<{ user: any; score: number }> = users
    .filter((u: any) => u.id !== listing.owner_user_id)
    .map((u: any) => {
      const pref = userIdToPref[u.id];
      let score = 0;
      if (pref) {
        if (pref.min_bedrooms != null) score += listing.bedrooms >= pref.min_bedrooms ? 1 : -1;
        if (pref.max_rent != null) score += listing.monthly_rent <= pref.max_rent ? 1 : -1;
        if (pref.desired_city) score += listing.city.toLowerCase() === pref.desired_city.toLowerCase() ? 1 : 0;
        if (pref.earliest_start && pref.latest_end) {
          const sOk = new Date(listing.start_date) >= new Date(pref.earliest_start);
          const eOk = new Date(listing.end_date) <= new Date(pref.latest_end);
          score += sOk && eOk ? 1 : -0.5;
        }
        score += scoreAmenities(pref.amenities, listing.amenities);
      }
      // active users bonus (recently created)
      const ageDays = (Date.now() - new Date(u.created_at).getTime()) / 86400000;
      score += Math.max(0, 1 - ageDays / 60);
      return { user: u, score };
    });

  return scored
    .sort((a: { user: any; score: number }, b: { user: any; score: number }) => b.score - a.score)
    .slice(0, limit)
    .map((x: { user: any; score: number }) => x.user);
}
