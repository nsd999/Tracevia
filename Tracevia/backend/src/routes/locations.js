const express = require('express');
const Location = require('../models/Location');
const Device = require('../models/Device');
const auth = require('../middleware/auth');
const router = express.Router();

// Get location history for a device
router.get('/device/:deviceId', auth, async (req, res) => {
  try {
    const { deviceId } = req.params;
    const { startDate, endDate, limit = 50 } = req.query;

    // Verify device belongs to user
    const device = await Device.findOne({ _id: deviceId, userId: req.user._id });
    if (!device) {
      return res.status(404).json({ message: 'Device not found' });
    }

    let query = { deviceId };
    
    // Add date range filter if provided
    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) query.timestamp.$gte = new Date(startDate);
      if (endDate) query.timestamp.$lte = new Date(endDate);
    }

    const locations = await Location.find(query)
      .sort({ timestamp: -1 })
      .limit(parseInt(limit));

    res.json({
      locations,
      count: locations.length,
      device: {
        id: device._id,
        name: device.name,
        deviceId: device.deviceId
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get latest location for a device
router.get('/device/:deviceId/latest', auth, async (req, res) => {
  try {
    const { deviceId } = req.params;

    // Verify device belongs to user
    const device = await Device.findOne({ _id: deviceId, userId: req.user._id });
    if (!device) {
      return res.status(404).json({ message: 'Device not found' });
    }

    const location = await Location.findOne({ deviceId })
      .sort({ timestamp: -1 });

    if (!location) {
      return res.status(404).json({ message: 'No location data found' });
    }

    res.json({ location });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all locations for user's devices
router.get('/user', auth, async (req, res) => {
  try {
    const { limit = 100 } = req.query;

    // Get user's devices
    const devices = await Device.find({ userId: req.user._id });
    const deviceIds = devices.map(device => device._id);

    const locations = await Location.find({ deviceId: { $in: deviceIds } })
      .populate('deviceId', 'name deviceId')
      .sort({ timestamp: -1 })
      .limit(parseInt(limit));

    res.json({
      locations,
      count: locations.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add new location (for mobile app integration)
router.post('/', auth, async (req, res) => {
  try {
    const {
      deviceId,
      latitude,
      longitude,
      accuracy,
      altitude,
      speed,
      heading,
      batteryLevel,
      timestamp
    } = req.body;

    // Verify device belongs to user
    const device = await Device.findOne({ _id: deviceId, userId: req.user._id });
    if (!device) {
      return res.status(404).json({ message: 'Device not found' });
    }

    const location = new Location({
      deviceId,
      userId: req.user._id,
      coordinates: {
        type: 'Point',
        coordinates: [longitude, latitude]
      },
      accuracy,
      altitude,
      speed,
      heading,
      batteryLevel,
      timestamp: timestamp || new Date()
    });

    await location.save();

    // Update device's last seen
    device.lastSeen = new Date();
    device.batteryLevel = batteryLevel;
    await device.save();

    res.status(201).json({
      message: 'Location saved successfully',
      location
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get device tracking statistics
router.get('/stats/:deviceId', auth, async (req, res) => {
  try {
    const { deviceId } = req.params;

    // Verify device belongs to user
    const device = await Device.findOne({ _id: deviceId, userId: req.user._id });
    if (!device) {
      return res.status(404).json({ message: 'Device not found' });
    }

    const stats = await Location.aggregate([
      { $match: { deviceId: device._id } },
      {
        $group: {
          _id: null,
          totalLocations: { $sum: 1 },
          firstLocation: { $min: '$timestamp' },
          lastLocation: { $max: '$timestamp' },
          avgAccuracy: { $avg: '$accuracy' },
          maxSpeed: { $max: '$speed' }
        }
      }
    ]);

    res.json({
      stats: stats[0] || {
        totalLocations: 0,
        firstLocation: null,
        lastLocation: null,
        avgAccuracy: null,
        maxSpeed: null
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
