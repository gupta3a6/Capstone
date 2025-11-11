import type { ListingProfile, SeekerProfile } from '../context/AppFlowContext'

export const LIFESTYLE_OPTIONS = [
  'No Smoking',
  'No Drinking',
  'Vegetarian Friendly',
  'Pet Friendly',
  'Quiet Evenings',
  'Early Riser',
  'Night Owl',
  'Study Focused',
  'Social',
]

export const MOVE_IN_OPTIONS = [
  'Spring 2025',
  'Summer 2025',
  'Fall 2025',
  'Winter 2025',
  'Specific Date',
]

export const MOCK_LISTINGS: Array<
  ListingProfile & { id: string; title: string; landlordName: string; contact: string }
> = [
  {
    id: 'listing-1',
    title: 'Modern Loft near Campus',
    landlordName: 'Alexa Johnson',
    contact: 'alexa.johnson@sub4you.com',
    photos: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
    ],
    headline: 'Spacious loft with natural light',
    rent: 950,
    moveInTiming: 'Fall 2025',
    leaseDuration: 'Aug 2025 - May 2026',
    distanceFromCampus: '0.5 miles',
    address: '215 Oak Street, Apt 3B',
    roomsTotal: 2,
    roomType: 'Private',
    bio: 'Looking for a responsible student to take over my lease. Great amenities and walking distance to campus.',
    lifestylePreferences: ['No Smoking', 'Study Focused', 'Quiet Evenings'],
    genderPreference: 'No preference',
  },
  {
    id: 'listing-2',
    title: 'Cozy Two-Bed Downtown',
    landlordName: 'Marcus Lee',
    contact: 'marcus.lee@sub4you.com',
    photos: [
      'https://images.unsplash.com/photo-1486304873000-235643847519?auto=format&fit=crop&w=1200&q=80',
    ],
    headline: 'Downtown apartment with skyline views',
    rent: 825,
    moveInTiming: 'Summer 2025',
    leaseDuration: 'June 2025 - August 2025',
    distanceFromCampus: '1.2 miles',
    address: '88 Market Street, Apt 204',
    roomsTotal: 2,
    roomType: 'Shared',
    bio: 'Roommate heading abroad for the summer, looking for an easy-going subletter.',
    lifestylePreferences: ['No Smoking', 'Night Owl', 'Pet Friendly'],
    genderPreference: 'Female identifying',
  },
  {
    id: 'listing-3',
    title: 'Townhome with Study Lounge',
    landlordName: 'Priya Desai',
    contact: 'priya.desai@sub4you.com',
    photos: [
      'https://images.unsplash.com/photo-1505691723518-36a5ac3be353?auto=format&fit=crop&w=1200&q=80',
    ],
    headline: 'Townhome with dedicated study lounge',
    rent: 780,
    moveInTiming: 'Spring 2025',
    leaseDuration: 'Jan 2025 - May 2025',
    distanceFromCampus: '0.8 miles',
    address: '42 Willow Lane',
    roomsTotal: 3,
    roomType: 'Private',
    bio: 'Quiet neighborhood with great bus access. All utilities included.',
    lifestylePreferences: ['No Drinking', 'Vegetarian Friendly', 'Early Riser'],
    genderPreference: 'No preference',
  },
  {
    id: 'listing-4',
    title: 'Luxury Studio at The Heights',
    landlordName: 'Evan Rodriguez',
    contact: 'evan.rodriguez@sub4you.com',
    photos: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
    ],
    headline: 'Elevated living with in-building gym',
    rent: 1100,
    moveInTiming: 'Specific Date',
    leaseDuration: 'Flexible',
    distanceFromCampus: '0.3 miles',
    address: '600 Summit Ave, Unit 1205',
    roomsTotal: 1,
    roomType: 'Private',
    bio: 'Transfer opportunity opened up. Looking for someone who appreciates premium amenities.',
    lifestylePreferences: ['No Smoking', 'Night Owl', 'Pet Friendly'],
    genderPreference: 'No preference',
  },
  {
    id: 'listing-5',
    title: 'Shared House near River Walk',
    landlordName: 'Sofia Martinez',
    contact: 'sofia.martinez@sub4you.com',
    photos: [
      'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1200&q=80',
    ],
    headline: 'Large house with backyard and shared workspace',
    rent: 690,
    moveInTiming: 'Fall 2025',
    leaseDuration: 'Aug 2025 - May 2026',
    distanceFromCampus: '1.8 miles',
    address: '17 River Walk Drive',
    roomsTotal: 4,
    roomType: 'Shared',
    bio: 'Creative household looking for another student to join our community-oriented home.',
    lifestylePreferences: ['Vegetarian Friendly', 'Night Owl', 'Social'],
    genderPreference: 'No preference',
  },
]

export const MOCK_SEEKERS: Array<
  SeekerProfile & {
    id: string
    name: string
    email: string
    campusYear: string
    desiredBudget: string
    preferredMoveIn: string
    contact: string
  }
> = [
  {
    id: 'seeker-1',
    name: 'Jamie Chen',
    email: 'jamie.chen@sub4you.com',
    campusYear: 'Junior · Computer Science',
    desiredBudget: '$700 - $900',
    preferredMoveIn: 'Fall 2025',
    contact: 'jamie.chen@sub4you.com',
    avatar: undefined,
    bio: 'Looking for a quiet place to focus on upcoming internship interviews.',
    lifestylePreferences: ['No Smoking', 'Study Focused', 'Quiet Evenings'],
  },
  {
    id: 'seeker-2',
    name: 'Riley Patel',
    email: 'riley.patel@sub4you.com',
    campusYear: 'Senior · Business',
    desiredBudget: '$800 - $1,000',
    preferredMoveIn: 'Summer 2025',
    contact: 'riley.patel@sub4you.com',
    avatar: undefined,
    bio: 'Completing final semester; hoping to live close to campus gym.',
    lifestylePreferences: ['No Smoking', 'Early Riser', 'Pet Friendly'],
  },
  {
    id: 'seeker-3',
    name: 'Taylor Brooks',
    email: 'taylor.brooks@sub4you.com',
    campusYear: 'Sophomore · Design',
    desiredBudget: '$600 - $800',
    preferredMoveIn: 'Spring 2025',
    contact: 'taylor.brooks@sub4you.com',
    avatar: undefined,
    bio: 'Interested in collaborative living spaces with creative roommates.',
    lifestylePreferences: ['Social', 'Night Owl', 'Vegetarian Friendly'],
  },
  {
    id: 'seeker-4',
    name: 'Morgan Lee',
    email: 'morgan.lee@sub4you.com',
    campusYear: 'Graduate · Engineering',
    desiredBudget: '$900 - $1,100',
    preferredMoveIn: 'Specific Date',
    contact: 'morgan.lee@sub4you.com',
    avatar: undefined,
    bio: 'Research assistant needing flexible lease terms during field work.',
    lifestylePreferences: ['No Drinking', 'Quiet Evenings', 'Study Focused'],
  },
]
