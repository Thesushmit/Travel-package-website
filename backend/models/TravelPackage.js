import mongoose, { Schema } from 'mongoose';

const travelPackageSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      lowercase: true
    },
    summary: {
      type: String,
      required: [true, 'Summary is required'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Description is required']
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price must be positive']
    },
    currency: {
      type: String,
      default: 'INR'
    },
    duration: {
      type: Number,
      required: [true, 'Duration is required'],
      min: [1, 'Duration must be at least 1 day']
    },
    seats_available: {
      type: Number,
      required: [true, 'Seats available is required'],
      min: [0, 'Seats cannot be negative']
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    images: [{
      type: String
    }],
    available_dates: [{
      type: String
    }],
    location_city: {
      type: String,
      required: [true, 'City is required']
    },
    location_country: {
      type: String,
      required: [true, 'Country is required']
    },
    tags: [{
      type: String,
      trim: true
    }],
    created_by: {
      type: Schema.Types.ObjectId,
      ref: 'User',
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

const TravelPackage = mongoose.model('TravelPackage', travelPackageSchema);

export default TravelPackage;
