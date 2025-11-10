import CartItem from '../models/CartItem.js';

const populatePackage = {
  path: 'package_id',
  select: 'title slug images price currency'
};

const formatItem = (item) => {
  const obj = item.toJSON();
  if (obj.package_id) {
    obj.travel_packages = {
      ...obj.package_id,
      id: obj.package_id.id
    };
    delete obj.package_id;
  }
  return obj;
};

export const getCart = async (req, res) => {
  const items = await CartItem.find({ user_id: req.user.id })
    .populate(populatePackage)
    .sort({ created_at: -1 });

  res.status(200).json({ cart: items.map(formatItem) });
};

export const upsertCartItem = async (req, res) => {
  const { package_id, number_of_guests = 1, booking_date = null } = req.body;

  if (!package_id) {
    return res.status(400).json({ message: 'package_id is required' });
  }

  const item = await CartItem.findOneAndUpdate(
    { user_id: req.user.id, package_id },
    {
      user_id: req.user.id,
      package_id,
      number_of_guests,
      booking_date
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  ).populate(populatePackage);

  res.status(200).json({ item: formatItem(item) });
};

export const updateCartItem = async (req, res) => {
  const { number_of_guests, booking_date } = req.body;

  const item = await CartItem.findOneAndUpdate(
    { _id: req.params.id, user_id: req.user.id },
    {
      ...(number_of_guests !== undefined && { number_of_guests }),
      booking_date: booking_date ?? null
    },
    { new: true }
  ).populate(populatePackage);

  if (!item) {
    return res.status(404).json({ message: 'Cart item not found' });
  }

  res.status(200).json({ item: formatItem(item) });
};

export const removeCartItem = async (req, res) => {
  await CartItem.findOneAndDelete({ _id: req.params.id, user_id: req.user.id });
  res.status(200).json({ message: 'Removed from cart' });
};

export const clearCart = async (req, res) => {
  await CartItem.deleteMany({ user_id: req.user.id });
  res.status(200).json({ message: 'Cart cleared' });
};
