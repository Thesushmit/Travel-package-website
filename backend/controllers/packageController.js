import TravelPackage from '../models/TravelPackage.js';

const buildFilters = (query) => {
  const filters = {};

  if (query.search) {
    const regex = new RegExp(query.search, 'i');
    filters.$or = [
      { title: regex },
      { location_city: regex },
      { location_country: regex },
      { summary: regex }
    ];
  }

  if (query.tags) {
    const tags = Array.isArray(query.tags) ? query.tags : query.tags.split(',');
    filters.tags = { $all: tags.map((tag) => tag.trim()).filter(Boolean) };
  }

  if (query.price) {
    const [min, max] = query.price.split(':').map(Number);
    filters.price = {};
    if (!Number.isNaN(min)) filters.price.$gte = min;
    if (!Number.isNaN(max)) filters.price.$lte = max;
    if (Object.keys(filters.price).length === 0) delete filters.price;
  }

  if (query.duration) {
    const [min, max] = query.duration.split(':').map(Number);
    filters.duration = {};
    if (!Number.isNaN(min)) filters.duration.$gte = min;
    if (!Number.isNaN(max)) filters.duration.$lte = max;
    if (Object.keys(filters.duration).length === 0) delete filters.duration;
  }

  return filters;
};

const buildSort = (sortBy) => {
  switch (sortBy) {
    case 'oldest':
      return { created_at: 1 };
    case 'price-low':
      return { price: 1 };
    case 'price-high':
      return { price: -1 };
    case 'rating':
      return { rating: -1 };
    case 'duration':
      return { duration: 1 };
    default:
      return { created_at: -1 };
  }
};

export const getPackages = async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 9;
  const skip = (page - 1) * limit;

  const filters = buildFilters(req.query);
  const sort = buildSort(req.query.sortBy);

  const [items, total] = await Promise.all([
    TravelPackage.find(filters).sort(sort).skip(skip).limit(limit),
    TravelPackage.countDocuments(filters)
  ]);

  res.status(200).json({
    data: items,
    count: total,
    page,
    totalPages: Math.ceil(total / limit)
  });
};

export const getAllTags = async (_req, res) => {
  const packages = await TravelPackage.find({}, { tags: 1, _id: 0 });
  const tags = new Set();
  packages.forEach((pkg) => {
    pkg.tags?.forEach((tag) => tags.add(tag));
  });
  res.status(200).json({ tags: Array.from(tags) });
};

export const getPackageBySlug = async (req, res) => {
  const pkg = await TravelPackage.findOne({ slug: req.params.slug });
  if (!pkg) {
    return res.status(404).json({ message: 'Package not found' });
  }
  res.status(200).json({ package: pkg });
};

export const getPackageById = async (req, res) => {
  const pkg = await TravelPackage.findById(req.params.id);
  if (!pkg) {
    return res.status(404).json({ message: 'Package not found' });
  }
  res.status(200).json({ package: pkg });
};

export const createPackage = async (req, res) => {
  const data = {
    ...req.body,
    created_by: req.user.id
  };

  const existingSlug = await TravelPackage.findOne({ slug: data.slug });
  if (existingSlug) {
    return res.status(409).json({ message: 'Slug already exists' });
  }

  const pkg = await TravelPackage.create(data);
  res.status(201).json({ package: pkg });
};

export const updatePackage = async (req, res) => {
  const pkg = await TravelPackage.findById(req.params.id);
  if (!pkg) {
    return res.status(404).json({ message: 'Package not found' });
  }

  if (req.body.slug && req.body.slug !== pkg.slug) {
    const slugExists = await TravelPackage.findOne({ slug: req.body.slug });
    if (slugExists) {
      return res.status(409).json({ message: 'Slug already exists' });
    }
  }

  Object.assign(pkg, req.body);
  await pkg.save();

  res.status(200).json({ package: pkg });
};

export const deletePackage = async (req, res) => {
  const pkg = await TravelPackage.findById(req.params.id);
  if (!pkg) {
    return res.status(404).json({ message: 'Package not found' });
  }

  await pkg.deleteOne();
  res.status(200).json({ message: 'Package deleted' });
};

export const seedPackages = async (_req, res) => {
  const now = new Date().toISOString();

  const base = [
    { title: 'Bali Adventure', slug: 'bali-adventure-7d', summary: 'Experience beaches, culture, and adventure in Bali', description: 'A 7-day curated tour covering Ubud, Uluwatu, and Nusa Penida.', price: 124999, currency: 'INR', duration: 7, seats_available: 20, rating: 4.7, images: ['https://images.unsplash.com/photo-1500530855697-b586d89ba3ee','https://images.unsplash.com/photo-1558981285-6f0c94958bb6'], available_dates: [now], location_city: 'Ubud', location_country: 'Indonesia', tags: ['beach','adventure','asia'] },
    { title: 'Swiss Alps Getaway', slug: 'swiss-alps-5d', summary: 'Stunning mountain views and cozy villages', description: 'Visit Interlaken, Lauterbrunnen, and Jungfraujoch in 5 days.', price: 184999, currency: 'INR', duration: 5, seats_available: 15, rating: 4.9, images: ['https://images.unsplash.com/photo-1491553895911-0055eca6402d','https://images.unsplash.com/photo-1521295121783-8a321d551ad2'], available_dates: [now], location_city: 'Interlaken', location_country: 'Switzerland', tags: ['mountain','europe','luxury'] },
    { title: 'Dubai City Break', slug: 'dubai-city-3d', summary: 'Skylines, shopping, and desert safari', description: 'A quick 3-day escape with desert safari and city tour.', price: 74999, currency: 'INR', duration: 3, seats_available: 30, rating: 4.5, images: ['https://images.unsplash.com/photo-1512453979798-5ea266f8880c'], available_dates: [now], location_city: 'Dubai', location_country: 'UAE', tags: ['city','desert','middle-east'] },
    { title: 'Kashmir Paradise', slug: 'kashmir-paradise-6d', summary: 'Dal Lake shikaras and snow-clad mountains', description: 'Srinagar, Gulmarg and Pahalgam in an unforgettable 6-day journey.', price: 52999, currency: 'INR', duration: 6, seats_available: 25, rating: 4.6, images: ['https://images.unsplash.com/photo-1603262110263-fb0112e7cc33'], available_dates: [now], location_city: 'Srinagar', location_country: 'India', tags: ['mountain','india','nature'] },
    { title: 'Goa Beach Escape', slug: 'goa-beach-4d', summary: 'Sun, sand and seafood', description: 'North and South Goa highlights with water sports options.', price: 24999, currency: 'INR', duration: 4, seats_available: 40, rating: 4.4, images: ['https://images.unsplash.com/photo-1548013146-72479768bada'], available_dates: [now], location_city: 'Goa', location_country: 'India', tags: ['beach','india','party'] },
    { title: 'Kerala Backwaters', slug: 'kerala-backwaters-5d', summary: 'Houseboat cruise and lush greenery', description: 'Alleppey houseboat, Munnar tea gardens and Kochi heritage.', price: 39999, currency: 'INR', duration: 5, seats_available: 28, rating: 4.6, images: ['https://images.unsplash.com/photo-1506089676908-3592f7389d4d'], available_dates: [now], location_city: 'Alleppey', location_country: 'India', tags: ['backwaters','india','relax'] },
    { title: 'Rajasthan Royal Tour', slug: 'rajasthan-royal-7d', summary: 'Palaces, forts and desert dunes', description: 'Jaipur, Udaipur, Jodhpur and a night in Thar desert.', price: 61999, currency: 'INR', duration: 7, seats_available: 22, rating: 4.7, images: ['https://images.unsplash.com/photo-1548013146-72479768bada?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80','https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1350&q=80'], available_dates: [now], location_city: 'Jaipur', location_country: 'India', tags: ['heritage','india','desert'] },
    { title: 'Thailand Island Hopper', slug: 'thailand-islands-6d', summary: 'Phi Phi and Phuket beaches', description: 'Island hopping, snorkeling and bustling night markets.', price: 56999, currency: 'INR', duration: 6, seats_available: 26, rating: 4.5, images: ['https://images.unsplash.com/photo-1507525428034-b723cf961d3e'], available_dates: [now], location_city: 'Phuket', location_country: 'Thailand', tags: ['beach','asia','snorkeling'] },
    { title: 'Paris & Versailles', slug: 'paris-versailles-5d', summary: 'City of lights and royal grandeur', description: 'Eiffel, Louvre and a day trip to Versailles palace.', price: 159999, currency: 'INR', duration: 5, seats_available: 18, rating: 4.8, images: ['https://images.unsplash.com/photo-1502602898657-3e91760cbb34'], available_dates: [now], location_city: 'Paris', location_country: 'France', tags: ['city','europe','romantic'] },
    { title: 'Tokyo Highlights', slug: 'tokyo-highlights-5d', summary: 'Tradition meets technology', description: 'Shibuya crossing, Asakusa temple and Mt. Fuji day trip.', price: 174999, currency: 'INR', duration: 5, seats_available: 16, rating: 4.7, images: ['https://images.unsplash.com/photo-1549692520-acc6669e2f0c'], available_dates: [now], location_city: 'Tokyo', location_country: 'Japan', tags: ['city','asia','culture'] },
    { title: 'Maldives Luxury Stay', slug: 'maldives-luxury-4d', summary: 'Overwater villas and turquoise lagoons', description: 'Premium resort stay with breakfast and sunset cruise.', price: 199999, currency: 'INR', duration: 4, seats_available: 10, rating: 4.9, images: ['https://images.unsplash.com/photo-1500375592092-40eb2168fd21'], available_dates: [now], location_city: 'Male', location_country: 'Maldives', tags: ['luxury','beach','relax'] },
    { title: 'New York City Break', slug: 'new-york-4d', summary: 'Skyscrapers, Broadway and Central Park', description: 'Times Square, Statue of Liberty and museum mile.', price: 139999, currency: 'INR', duration: 4, seats_available: 20, rating: 4.6, images: ['https://images.unsplash.com/photo-1468436139062-f60a71c5c892'], available_dates: [now], location_city: 'New York', location_country: 'USA', tags: ['city','america','shopping'] },
    { title: 'Bali Wellness Retreat', slug: 'bali-wellness-5d', summary: 'Yoga, spa and healthy cuisine', description: 'Mindfulness sessions and nature excursions in Ubud.', price: 89999, currency: 'INR', duration: 5, seats_available: 24, rating: 4.7, images: ['https://images.unsplash.com/photo-1506126613408-eca07ce68773'], available_dates: [now], location_city: 'Ubud', location_country: 'Indonesia', tags: ['wellness','asia','relax'] },
    { title: 'Leh-Ladakh Expedition', slug: 'ladakh-expedition-7d', summary: 'High passes and crystal lakes', description: 'Pangong, Nubra and Khardung La with homestay experiences.', price: 54999, currency: 'INR', duration: 7, seats_available: 20, rating: 4.8, images: ['https://images.unsplash.com/photo-1518684079-3c830dcef090'], available_dates: [now], location_city: 'Leh', location_country: 'India', tags: ['mountain','india','adventure'] }
  ];

  // Insert only the ones whose slug doesn't exist
  const existing = await TravelPackage.find({ slug: { $in: base.map(p => p.slug) } }, { slug: 1 });
  const existingSlugs = new Set(existing.map(e => e.slug));
  const toInsert = base.filter(p => !existingSlugs.has(p.slug));

  if (toInsert.length > 0) {
    await TravelPackage.insertMany(toInsert);
  }

  const total = await TravelPackage.countDocuments();
  return res.status(201).json({ message: 'Packages ensured', count: total, inserted: toInsert.length });
};
