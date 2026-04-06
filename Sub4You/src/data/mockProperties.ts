import HouseShowingImage from '../assets/HouseShowing-image1.jpeg'
import RoomForSubleaseImage from '../assets/RoomForSublease.jpg'

export const mockProperties = [
  {
    id: 1,
    name: 'Luxury Downtown Apartment',
    rent: '1,200',
    subleasePeriod: 'May - Aug 2026',
    bedrooms: 2,
    location: 'Downtown',
    image: HouseShowingImage,
    guests: 4,
    beds: 2,
    baths: 2,
    rating: 4.8,
    reviews: 12,
    host: {
      name: 'Sarah',
      status: 'Superhost'
    },
    images: [
      HouseShowingImage,
      RoomForSubleaseImage,
      HouseShowingImage,
      RoomForSubleaseImage,
      HouseShowingImage
    ],
    description: "Enjoy luxurious living in the heart of Downtown. This modern apartment features high-end appliances, floor-to-ceiling windows, and access to a rooftop pool. Perfect for professionals or students wanting a premium summer experience."
  },
  {
    id: 2,
    name: 'Cozy Studio Near Campus',
    rent: '850',
    subleasePeriod: 'Jun - Aug 2026',
    bedrooms: 1,
    location: 'University District',
    image: RoomForSubleaseImage,
    guests: 2,
    beds: 1,
    baths: 1,
    rating: 4.5,
    reviews: 8,
    host: {
      name: 'Michael',
      status: 'New Host'
    },
    images: [
      RoomForSubleaseImage,
      HouseShowingImage,
      RoomForSubleaseImage,
      HouseShowingImage,
      RoomForSubleaseImage
    ],
    description: "A very cozy and comfortable studio just steps away from campus. Ideal for a student staying over the summer. Includes high-speed Wi-Fi and a small kitchenette for all your basic cooking needs."
  },
  {
    id: 3,
    name: 'Modern 3-Bedroom House',
    rent: '900',
    subleasePeriod: 'Jan - May 2027',
    bedrooms: 3,
    location: 'Northgate',
    image: HouseShowingImage,
    guests: 5,
    beds: 3,
    baths: 2.5,
    rating: 4.9,
    reviews: 24,
    host: {
      name: 'Elena',
      status: 'Superhost'
    },
    images: [
      HouseShowingImage,
      RoomForSubleaseImage,
      HouseShowingImage,
      RoomForSubleaseImage,
      HouseShowingImage
    ],
    description: "Spacious modern home perfect for an entire group. Features a large backyard, renovated interior, and quiet neighborhood. Great place to focus on studies or relax with friends."
  },
  {
    id: 4,
    name: 'Spacious Shared Room',
    rent: '650',
    subleasePeriod: 'Sep - Dec 2026',
    bedrooms: 4,
    location: 'Capitol Hill',
    image: RoomForSubleaseImage,
    guests: 1,
    beds: 1,
    baths: 2,
    rating: 4.2,
    reviews: 5,
    host: {
      name: 'David',
      status: 'Host'
    },
    images: [
      RoomForSubleaseImage,
      HouseShowingImage,
      RoomForSubleaseImage,
      HouseShowingImage,
      RoomForSubleaseImage
    ],
    description: "Affordable shared room in a large 4-bedroom house. Great roommates, shared kitchen and living spaces. Convenient access to public transit."
  },
  {
    id: 5,
    name: 'Sunny 2-Bed Condo',
    rent: '1,400',
    subleasePeriod: 'Aug - Dec 2026',
    bedrooms: 2,
    location: 'Hyde Park',
    image: RoomForSubleaseImage,
    guests: 3,
    beds: 2,
    baths: 2,
    rating: 5.0,
    reviews: 30,
    host: {
      name: 'Jessica',
      status: 'Superhost'
    },
    images: [
      RoomForSubleaseImage,
      HouseShowingImage,
      RoomForSubleaseImage,
      HouseShowingImage,
      RoomForSubleaseImage
    ],
    description: "Beautiful, sun-filled condo in the desirable Hyde Park area. Secure building, dedicated parking, and premium furnishings."
  },
  {
    id: 6,
    name: 'Historic Brick House',
    rent: '750',
    subleasePeriod: 'May - Aug 2026',
    bedrooms: 1,
    location: 'Over-the-Rhine',
    image: HouseShowingImage,
    guests: 2,
    beds: 1,
    baths: 1,
    rating: 4.6,
    reviews: 18,
    host: {
      name: 'Brian',
      status: 'Host'
    },
    images: [
      HouseShowingImage,
      RoomForSubleaseImage,
      HouseShowingImage,
      RoomForSubleaseImage,
      HouseShowingImage
    ],
    description: "Live in a piece of history! This brick house in OTR combines historic charm with modern amenities. Walkable to the best bars and restaurants."
  },
  {
    id: 7,
    name: 'Modern Loft',
    rent: '1,100',
    subleasePeriod: 'Jun - Dec 2026',
    bedrooms: 1,
    location: 'Downtown',
    image: RoomForSubleaseImage,
    guests: 2,
    beds: 1,
    baths: 1,
    rating: 4.7,
    reviews: 15,
    host: {
      name: 'Alex',
      status: 'New Host'
    },
    images: [
      RoomForSubleaseImage,
      HouseShowingImage,
      RoomForSubleaseImage,
      HouseShowingImage,
      RoomForSubleaseImage
    ],
    description: "Industrial style modern loft with high ceilings and exposed ductwork. Open concept living in a very central location."
  },
  {
    id: 8,
    name: 'Campus View Apartment',
    rent: '950',
    subleasePeriod: 'Sep - May 2027',
    bedrooms: 2,
    location: 'University District',
    image: HouseShowingImage,
    guests: 3,
    beds: 2,
    baths: 1,
    rating: 4.3,
    reviews: 9,
    host: {
      name: 'Emily',
      status: 'Host'
    },
    images: [
      HouseShowingImage,
      RoomForSubleaseImage,
      HouseShowingImage,
      RoomForSubleaseImage,
      HouseShowingImage
    ],
    description: "Apartment with a direct view of the campus skyline. Save commute time and live right across the street from your classes!"
  }
]
