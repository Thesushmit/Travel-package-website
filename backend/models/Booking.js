import mongoose, { Schema } from 'mongoose';

const bookingSchema = new Schema(
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
      required: true
    },
    number_of_guests: {
      type: Number,
      default: 1,
      min: 1
    },
    total_price: {
      type: Number,
      required: true,
      min: 0
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'completed'],
      default: 'pending'
    },
    special_requests: {
      type: String,
      default: null
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

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;
