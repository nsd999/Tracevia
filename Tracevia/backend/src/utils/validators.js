const Joi = require('joi');

// User registration validation
const registerValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
  });
  return schema.validate(data);
};

// User login validation
const loginValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
  });
  return schema.validate(data);
};

// Device registration validation
const deviceValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(50).required(),
    deviceId: Joi.string().required(),
    deviceType: Joi.string().valid('mobile', 'tablet', 'laptop', 'other').default('mobile'),
    os: Joi.string().valid('ios', 'android', 'windows', 'macos', 'linux', 'other').required(),
    model: Joi.string().optional(),
    manufacturer: Joi.string().optional()
  });
  return schema.validate(data);
};

// Location data validation
const locationValidation = (data) => {
  const schema = Joi.object({
    deviceId: Joi.string().required(),
    latitude: Joi.number().min(-90).max(90).required(),
    longitude: Joi.number().min(-180).max(180).required(),
    accuracy: Joi.number().min(0).optional(),
    altitude: Joi.number().optional(),
    speed: Joi.number().min(0).optional(),
    heading: Joi.number().min(0).max(360).optional(),
    batteryLevel: Joi.number().min(0).max(100).optional(),
    timestamp: Joi.date().optional()
  });
  return schema.validate(data);
};

module.exports = {
  registerValidation,
  loginValidation,
  deviceValidation,
  locationValidation
};
