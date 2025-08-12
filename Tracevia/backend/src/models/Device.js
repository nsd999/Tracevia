const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Device name is required'],
    trim: true,
    maxlength: [50, 'Device name cannot exceed 50 characters']
  },
  deviceId: {
    type: String,
    required: true,
    unique: true
  },
  deviceType: {
    type: String,
    enum: ['mobile', 'tablet', 'laptop', 'other'],
    default: 'mobile'
  },
  os: {
    type: String,
    enum: ['ios', 'android', 'windows', 'macos', 'linux', 'other'],
    required: true
  },
  model: {
    type: String,
    trim: true
  },
  manufacturer: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastSeen: {
    type: Date,
    default: Date.now
  },
  batteryLevel: {
    type: Number,
    min: 0,
    max: 100,
    default: null
  },
  locationEnabled: {
    type: Boolean,
    default: true
  },
  notificationToken: {
    type: String,
    default: null
  },
  settings: {
    updateInterval: {
      type: Number,
      default: 30 // seconds
    },
    highAccuracy: {
      type: Boolean,
      default: true
    },
    distanceFilter: {
      type: Number,
      default: 10 // meters
    }
  }
}, {
  timestamps: true
});

// Index for faster queries
deviceSchema.index({ userId: 1, deviceId: 1 });
deviceSchema.index({ deviceId: 1 });

module.exports = mongoose.model('Device', deviceSchema);
