import mongoose, { Schema } from 'mongoose';

const cartItemSchema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    package_id: {
      type: Schema.Types.ObjectId,
      ref: 'TravelPackage',
      required: true
    },
    booking_date: {
      type: Date,
      default: null
    },
    number_of_guests: {
      type: Number,
      default: 1,
      min: 1
    }
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    },
    toJSON: {
      virtuals: true,
      transform: (_, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      }
    }
  }
);

cartItemSchema.index({ user_id: 1, package_id: 1 }, { unique: true });

const CartItem = mongoose.model('CartItem', cartItemSchema);

export default CartItem;
