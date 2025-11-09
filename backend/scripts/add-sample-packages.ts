/**
 * Script to add sample travel packages to the database
 * Run this with: npx tsx scripts/add-sample-packages.ts
 * Make sure you have VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY set in your .env file
 */

import { config } from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env file from backend directory
config({ path: resolve(__dirname, '../.env') });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || '';
const SUPABASE_PUBLISHABLE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || '';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Use service role key if available, otherwise use anon key
const supabaseKey = SUPABASE_SERVICE_ROLE_KEY || SUPABASE_PUBLISHABLE_KEY;

if (!SUPABASE_URL || !supabaseKey) {
  console.error('Please set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY (or SUPABASE_SERVICE_ROLE_KEY) environment variables');
  console.error('\nNote: For inserting packages, you can use SUPABASE_SERVICE_ROLE_KEY in your .env file');
  console.error('Get it from: Supabase Dashboard > Settings > API > service_role key');
  process.exit(1);
}

// Create client with service role key if available (bypasses RLS)
const supabase = createClient(SUPABASE_URL, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const samplePackages = [
  {
    slug: 'paris-romantic-getaway',
    title: 'Paris Romantic Getaway',
    summary: 'Experience the City of Love with a romantic 5-day trip to Paris',
    description: `Discover the magic of Paris with this romantic getaway package. Visit the iconic Eiffel Tower, stroll along the Seine River, explore the Louvre Museum, and enjoy authentic French cuisine at charming local restaurants. This package includes guided tours, luxury accommodations, and romantic dinner experiences.

Highlights:
- Eiffel Tower visit with skip-the-line tickets
- Seine River cruise at sunset
- Louvre Museum guided tour
- Montmartre and Sacré-Cœur exploration
- French cooking class
- Luxury hotel in the heart of Paris`,
    price: 107917,
    currency: 'INR',
    duration: 5,
    location_city: 'Paris',
    location_country: 'France',
    seats_available: 20,
    rating: 4.8,
    tags: ['romantic', 'city', 'culture', 'food'],
    images: [
      'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800',
      'https://images.unsplash.com/photo-1502602898736-1c2c53edb2c0?w=800',
      'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=800',
    ],
  },
  {
    slug: 'bali-tropical-paradise',
    title: 'Bali Tropical Paradise',
    summary: 'Relax and rejuvenate in the beautiful island of Bali',
    description: `Escape to the tropical paradise of Bali. Enjoy pristine beaches, ancient temples, lush rice terraces, and world-class spa treatments. This package offers a perfect blend of relaxation and adventure in one of the world's most beautiful destinations.

Highlights:
- Beachfront resort accommodation
- Ubud rice terrace tour
- Traditional Balinese spa treatments
- Temple visits (Tanah Lot, Uluwatu)
- Water sports activities
- Authentic Balinese cuisine experience`,
    price: 74617,
    currency: 'INR',
    duration: 7,
    location_city: 'Bali',
    location_country: 'Indonesia',
    seats_available: 30,
    rating: 4.9,
    tags: ['beach', 'relaxation', 'spa', 'tropical'],
    images: [
      'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=800',
      'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800',
      'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800',
    ],
  },
  {
    slug: 'tokyo-culture-adventure',
    title: 'Tokyo Culture Adventure',
    summary: 'Immerse yourself in Japanese culture and technology',
    description: `Explore the vibrant city of Tokyo, where ancient traditions meet cutting-edge technology. From historic temples to futuristic districts, experience the best of Japanese culture, cuisine, and innovation.

Highlights:
- Shibuya and Harajuku exploration
- Traditional tea ceremony
- Tsukiji Fish Market visit
- Tokyo Skytree observation deck
- Akihabara electronics district
- Traditional kaiseki dining experience`,
    price: 132917,
    currency: 'INR',
    duration: 6,
    location_city: 'Tokyo',
    location_country: 'Japan',
    seats_available: 15,
    rating: 4.7,
    tags: ['culture', 'city', 'technology', 'food'],
    images: [
      'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800',
      'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800',
      'https://images.unsplash.com/photo-1513407030348-c983a97b98d8?w=800',
    ],
  },
  {
    slug: 'santorini-sunset-experience',
    title: 'Santorini Sunset Experience',
    summary: 'Witness the most beautiful sunsets in the world',
    description: `Experience the breathtaking beauty of Santorini with its iconic white-washed buildings, blue domes, and stunning sunsets. This package offers luxury accommodations, wine tasting, and unforgettable views.

Highlights:
- Oia sunset viewing
- Wine tasting at local vineyards
- Ancient Akrotiri ruins
- Red and Black sand beaches
- Traditional Greek cooking class
- Luxury cave hotel accommodation`,
    price: 99517,
    currency: 'INR',
    duration: 4,
    location_city: 'Santorini',
    location_country: 'Greece',
    seats_available: 25,
    rating: 4.9,
    tags: ['romantic', 'beach', 'luxury', 'sunset'],
    images: [
      'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800',
      'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800',
      'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800',
    ],
  },
  {
    slug: 'new-york-city-explorer',
    title: 'New York City Explorer',
    summary: 'Discover the Big Apple with this comprehensive city tour',
    description: `Experience the energy and excitement of New York City. Visit iconic landmarks, enjoy Broadway shows, explore diverse neighborhoods, and indulge in world-class dining and shopping.

Highlights:
- Statue of Liberty and Ellis Island
- Central Park exploration
- Broadway show tickets
- Times Square and Empire State Building
- Brooklyn Bridge walk
- Food tour of diverse neighborhoods`,
    price: 116317,
    currency: 'INR',
    duration: 5,
    location_city: 'New York',
    location_country: 'United States',
    seats_available: 40,
    rating: 4.6,
    tags: ['city', 'culture', 'entertainment', 'shopping'],
    images: [
      'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800',
      'https://images.unsplash.com/photo-1518391846015-55a9cc003b25?w=800',
      'https://images.unsplash.com/photo-1522083165195-3424ed129620?w=800',
    ],
  },
  {
    slug: 'dubai-luxury-escape',
    title: 'Dubai Luxury Escape',
    summary: 'Experience ultimate luxury in the heart of the desert',
    description: `Indulge in the opulence of Dubai with this luxury package. Stay in world-class hotels, enjoy desert safaris, visit the Burj Khalifa, and experience the finest dining and shopping.

Highlights:
- Burj Khalifa observation deck
- Desert safari with camel riding
- Dubai Mall shopping experience
- Palm Jumeirah tour
- Luxury yacht cruise
- Fine dining at Michelin-starred restaurants`,
    price: 166117,
    currency: 'INR',
    duration: 5,
    location_city: 'Dubai',
    location_country: 'United Arab Emirates',
    seats_available: 20,
    rating: 4.8,
    tags: ['luxury', 'desert', 'shopping', 'adventure'],
    images: [
      'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800',
      'https://images.unsplash.com/photo-1513346940221-6f28d28964b1?w=800',
      'https://images.unsplash.com/photo-1539650116574-75c0c6d73ab6?w=800',
    ],
  },
  {
    slug: 'iceland-northern-lights',
    title: 'Iceland Northern Lights',
    summary: 'Chase the aurora borealis in Iceland',
    description: `Witness the magical Northern Lights in Iceland. Explore glaciers, geysers, waterfalls, and natural hot springs while staying in cozy accommodations.

Highlights:
- Northern Lights viewing tours
- Golden Circle tour
- Blue Lagoon spa experience
- Glacier hiking
- Waterfall visits (Gullfoss, Seljalandsfoss)
- Reykjavik city exploration`,
    price: 124417,
    currency: 'INR',
    duration: 6,
    location_city: 'Reykjavik',
    location_country: 'Iceland',
    seats_available: 18,
    rating: 4.9,
    tags: ['nature', 'adventure', 'aurora', 'winter'],
    images: [
      'https://images.unsplash.com/photo-1531572753322-ad063cecc140?w=800',
      'https://images.unsplash.com/photo-1504829857797-ddff29c27927?w=800',
      'https://images.unsplash.com/photo-1531572753322-ad063cecc140?w=800',
    ],
  },
  {
    slug: 'machu-picchu-adventure',
    title: 'Machu Picchu Adventure',
    summary: 'Trek to the ancient Incan citadel',
    description: `Embark on an unforgettable journey to Machu Picchu. Hike through the Sacred Valley, explore ancient Incan ruins, and experience the rich culture of Peru.

Highlights:
- Machu Picchu guided tour
- Sacred Valley exploration
- Traditional Peruvian cuisine
- Cusco city tour
- Local market visits
- Comfortable mountain lodges`,
    price: 141117,
    currency: 'INR',
    duration: 8,
    location_city: 'Cusco',
    location_country: 'Peru',
    seats_available: 12,
    rating: 4.8,
    tags: ['adventure', 'hiking', 'history', 'culture'],
    images: [
      'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=800',
      'https://images.unsplash.com/photo-1587595431973-160d0d94c3d0?w=800',
      'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=800',
    ],
  },
  {
    slug: 'maldives-overwater-bungalow',
    title: 'Maldives Overwater Bungalow',
    summary: 'Luxury overwater bungalow experience in paradise',
    description: `Relax in ultimate luxury with an overwater bungalow in the Maldives. Enjoy crystal-clear waters, pristine beaches, world-class diving, and unparalleled relaxation.

Highlights:
- Overwater bungalow accommodation
- Snorkeling and diving
- Spa treatments
- Sunset cruises
- Private beach access
- Fine dining experiences`,
    price: 207717,
    currency: 'INR',
    duration: 5,
    location_city: 'Malé',
    location_country: 'Maldives',
    seats_available: 10,
    rating: 5.0,
    tags: ['luxury', 'beach', 'diving', 'relaxation'],
    images: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
      'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
    ],
  },
];

async function addSamplePackages() {
  console.log('Adding sample packages to database...\n');

  // Check if we have service role key
  const usingServiceRole = !!SUPABASE_SERVICE_ROLE_KEY;
  
  if (!usingServiceRole) {
    console.log('⚠️  Using anon key - will use insert function to bypass RLS\n');
  } else {
    console.log('✓ Using service role key - bypassing RLS directly\n');
  }

  for (const pkg of samplePackages) {
    try {
      let result;
      
      if (usingServiceRole) {
        // Use direct insert with service role (bypasses RLS)
        const { data, error } = await supabase
          .from('travel_packages')
          .insert(pkg)
          .select()
          .single();
        
        result = { data, error };
      } else {
        // Use the insert function (bypasses RLS via SECURITY DEFINER)
        const { data, error } = await supabase.rpc('insert_travel_package', {
          p_slug: pkg.slug,
          p_title: pkg.title,
          p_summary: pkg.summary,
          p_description: pkg.description,
          p_price: pkg.price,
          p_duration: pkg.duration,
          p_location_city: pkg.location_city,
          p_location_country: pkg.location_country,
          p_seats_available: pkg.seats_available,
          p_currency: pkg.currency,
          p_images: pkg.images,
          p_tags: pkg.tags,
          p_rating: pkg.rating
        });
        
        result = { data: data ? { id: data } : null, error };
      }

      if (result.error) {
        if (result.error.code === '23505' || result.error.message?.includes('duplicate')) {
          console.log(`✓ Package "${pkg.title}" already exists, skipping...`);
        } else {
          console.error(`✗ Error adding "${pkg.title}":`, result.error.message);
        }
      } else {
        console.log(`✓ Successfully added: ${pkg.title}`);
      }
    } catch (error: any) {
      if (error.message?.includes('duplicate') || error.code === '23505') {
        console.log(`✓ Package "${pkg.title}" already exists, skipping...`);
      } else {
        console.error(`✗ Error adding "${pkg.title}":`, error.message);
      }
    }
  }

  console.log('\n✓ Sample packages addition complete!');
}

addSamplePackages()
  .then(() => {
    console.log('Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Script failed:', error);
    process.exit(1);
  });

