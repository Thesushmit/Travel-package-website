import WishlistItem from '../models/WishlistItem.js';

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

export const getWishlist = async (req, res) => {
  const items = await WishlistItem.find({ user_id: req.user.id }).populate(populatePackage).sort({ created_at: -1 });
  res.status(200).json({ wishlist: items.map(formatItem) });
};

export const addToWishlist = async (req, res) => {
  const { package_id } = req.body;
  if (!package_id) {
    return res.status(400).json({ message: 'package_id is required' });
  }

  const item = await WishlistItem.findOneAndUpdate(
    { user_id: req.user.id, package_id },
    { user_id: req.user.id, package_id },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  ).populate(populatePackage);

  res.status(200).json({ item: formatItem(item) });
};

export const removeFromWishlist = async (req, res) => {
  await WishlistItem.findOneAndDelete({ user_id: req.user.id, _id: req.params.id });
  res.status(200).json({ message: 'Removed from wishlist' });
};
