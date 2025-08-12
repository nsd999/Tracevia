const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  deviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Device',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  coordinates: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
      index: '2dsphere'
    }
  },
  accuracy: {
    type: Number,
    default: null
  },
  altitude: {
    type: Number,
    default: null
  },
  speed: {
    type: Number,
    default: null
  },
  heading: {
    type: Number,
    default: null
  },
  batteryLevel: {
    type: Number,
    min: 0,
    max: 100,
    default: null
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  },
  isMockLocation: {
    type: Boolean,
    default: false
  },
  provider: {
    type: String,
    enum: ['gps', 'network', 'wifi', 'passive', 'fused'],
    default: 'gps'
  }
}, {
  timestamps: true
});

// Compound index for efficient queries
locationSchema.index({ deviceId: 1, timestamp: -1 });
locationSchema.index({ userId: 1, timestamp: -1 });

// Virtual for formatted coordinates
locationSchema.virtual('latitude').get(function() {
  return this.coordinates.coordinates[1];
});

locationSchema.virtual('longitude').get(function() {
  return this.coordinates.coordinates[0];
});

module.exports = mongoose.model('Location', locationSchema);
