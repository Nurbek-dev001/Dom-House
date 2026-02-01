import mongoose from "mongoose";

const propertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  location: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  city: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  price: {
    type: Number,
    required: true,
    index: true
  },
  image: { 
    type: [String],
    required: true
  },
  beds: {
    type: Number,
    required: true,
  },
  baths: {
    type: Number,
    required: true,
  },
  sqft: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    enum: ['house', 'apartment', 'condo', 'townhouse', 'flat', 'villa', 'commercial'],
    required: true,
    index: true
  },
  availability: {
    type: String,
    enum: ['available', 'sold', 'rented', 'pending'],
    default: 'available',
    index: true
  },
  description: {
    type: String,
    required: true,
  },
  amenities: {
    type: [String],
    default: []
  },
  phone: {
    type: String,
    required: true,
  },
  // Owner reference
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  // Reviews (embedded documents)
  reviews: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true
    },
    comment: {
      type: String,
      trim: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  // Statistics
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
    index: true
  },
  viewCount: {
    type: Number,
    default: 0
  },
  appointmentCount: {
    type: Number,
    default: 0
  },
  tags: [{
    type: String,
    trim: true
  }],
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Compound indexes for optimized queries
propertySchema.index({ city: 1, price: 1 });
propertySchema.index({ type: 1, availability: 1 });
propertySchema.index({ owner: 1, createdAt: -1 });
propertySchema.index({ city: 1, type: 1, price: 1 });

// Text index for search functionality
propertySchema.index({ title: 'text', description: 'text', location: 'text' });

const Property = mongoose.model("Property", propertySchema);

export default Property;
