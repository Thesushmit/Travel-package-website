import Booking from '../models/Booking.js';
import TravelPackage from '../models/TravelPackage.js';

export const getBookings = async (req, res) => {
  const bookings = await Booking.find({ user_id: req.user.id })
    .sort({ created_at: -1 })
    .populate({
      path: 'package_id',
      select: 'title slug images location_city location_country price currency duration'
    });

  const formatted = bookings.map((booking) => {
    const bookingObj = booking.toJSON();
    if (bookingObj.package_id) {
      bookingObj.travel_packages = {
        ...bookingObj.package_id,
        id: bookingObj.package_id.id
      };
      delete bookingObj.package_id;
    }
    return bookingObj;
  });

  res.status(200).json({ bookings: formatted });
};

export const createBooking = async (req, res) => {
  const { package_id, booking_date, number_of_guests = 1, special_requests } = req.body;

  if (!package_id || !booking_date) {
    return res.status(400).json({ message: 'Package and booking date are required' });
  }

  const pkg = await TravelPackage.findById(package_id);
  if (!pkg) {
    return res.status(404).json({ message: 'Package not found' });
  }

  if (number_of_guests > pkg.seats_available) {
    return res.status(400).json({ message: `Only ${pkg.seats_available} seats available` });
  }

  const totalPrice = pkg.price * number_of_guests;

  const booking = await Booking.create({
    user_id: req.user.id,
    package_id,
    booking_date,
    number_of_guests,
    special_requests: special_requests || null,
    total_price: totalPrice
  });

  const populated = await booking.populate({
    path: 'package_id',
    select: 'title slug images location_city location_country price currency duration'
  });

  const bookingObj = populated.toJSON();
  bookingObj.travel_packages = {
    ...bookingObj.package_id,
    id: bookingObj.package_id.id
  };
  delete bookingObj.package_id;

  res.status(201).json({ booking: bookingObj });
};
