# Tracevia Backend

This is the backend API for the Tracevia GPS tracking application, built with Node.js, Express, and MongoDB.

## Features

- **User Authentication**: Secure registration and login with JWT
- **Device Management**: Register and manage GPS tracking devices
- **Real-time Location Tracking**: Store and retrieve GPS coordinates
- **WebSocket Support**: Real-time updates via Socket.io
- **Security**: Helmet, rate limiting, CORS, and input validation

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

3. Update `.env` with your configuration:
- MongoDB connection string
- JWT secret
- Google Maps API key

4. Start MongoDB service

5. Run the server:
```bash
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Devices
- `GET /api/devices` - Get user's devices
- `POST /api/devices` - Register new device
- `GET /api/devices/:id` - Get device details
- `PUT /api/devices/:id` - Update device
- `DELETE /api/devices/:id` - Delete device

### Locations
- `GET /api/locations/device/:deviceId` - Get location history
- `GET /api/locations/device/:deviceId/latest` - Get latest location
- `GET /api/locations/user` - Get all user's locations
- `POST /api/locations` - Add new location
- `GET /api/locations/stats/:deviceId` - Get tracking statistics

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `PUT /api/users/password` - Change password

## WebSocket Events

### Client to Server
- `join-device` - Join a device room for real-time updates
- `location-update` - Send location update

### Server to Client
- `new-location` - New location data for device

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting
- CORS protection
- Input validation with Joi
- Helmet security headers
