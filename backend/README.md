# Solo Sparks Backend

A Node.js/Express backend for the Solo Sparks personal growth and self-reflection application. This backend provides APIs for user authentication, quest management, reflections, rewards, and personality profiling.

## 🚀 Features

- **User Authentication**: JWT-based authentication with secure password hashing
- **Quest System**: Daily quests with categories (emotional, productivity, social, physical, creative)
- **Reflection Management**: Store and manage user reflections with media uploads
- **Rewards System**: Spark points and reward redemption system
- **Personality Profiling**: MBTI, Big Five, and Enneagram personality assessments
- **File Upload**: Cloudinary integration for image and audio uploads
- **Mood Tracking**: Daily mood logging and emotional state management
- **Analytics**: User progress tracking and insights

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer + Cloudinary
- **Validation**: Express-validator
- **CORS**: Cross-origin resource sharing enabled
- **Environment**: TypeScript

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB database
- Cloudinary account (for file uploads)
- npm or yarn package manager

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Solo-Sparks/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the backend root directory:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```

4. **Database Setup**
   - Ensure MongoDB is running
   - The application will automatically create collections on first run

5. **Seed Data (Optional)**
   ```bash
   npm run seed
   ```
   This will populate the database with demo users and sample data.

## 🚀 Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm run build
npm start
```

The server will start on `http://localhost:5000` (or the PORT specified in your .env file).

## 📚 API Documentation

### Authentication Endpoints

#### POST `/api/auth/register`
Register a new user
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password123!"
}
```

#### POST `/api/auth/login`
Login user
```json
{
  "email": "john@example.com",
  "password": "Password123!"
}
```

#### POST `/api/auth/logout`
Logout user (clears JWT cookie)

#### GET `/api/auth/me`
Get current user profile (requires authentication)

### Quest Endpoints

#### GET `/api/quests/today`
Get today's quest for the user

#### GET `/api/quests/history`
Get user's quest history

#### GET `/api/quests/active`
Get user's active quests

#### POST `/api/quests/:id/complete`
Complete a quest with optional reflection

### Reflection Endpoints

#### GET `/api/reflections`
Get user's reflections with optional filtering

#### POST `/api/reflections`
Create a new reflection

#### DELETE `/api/reflections/:id`
Delete a reflection

### Profile Endpoints

#### GET `/api/profile`
Get user's complete profile including personality data

#### PUT `/api/profile/step`
Update a specific onboarding step

#### POST `/api/profile/step/:step/skip`
Skip an onboarding step

### Rewards Endpoints

#### GET `/api/rewards`
Get available rewards

#### GET `/api/rewards/user/points`
Get user's spark points

#### POST `/api/rewards/:id/redeem`
Redeem a reward

#### GET `/api/rewards/redemptions`
Get user's redemption history

### File Upload Endpoints

#### POST `/api/upload/image`
Upload an image file

#### POST `/api/upload/audio`
Upload an audio file

## 🗂️ Project Structure

```
backend/
├── src/
│   ├── config/           # Configuration files
│   │   ├── db.ts        # Database configuration
│   │   ├── cloudinary.ts # Cloudinary setup
│   │   └── rewardsConfig.ts # Rewards configuration
│   ├── controllers/      # Route controllers
│   │   ├── userController.ts
│   │   ├── questController.ts
│   │   ├── reflectionController.ts
│   │   ├── rewardsController.ts
│   │   └── uploadController.ts
│   ├── middleware/       # Custom middleware
│   │   ├── authMiddleware.ts
│   │   └── multerMiddleware.ts
│   ├── models/          # Mongoose models
│   │   ├── userModel.ts
│   │   ├── reflectionModel.ts
│   │   └── redemptionModel.ts
│   ├── routes/          # API routes
│   │   ├── userRoutes.ts
│   │   ├── questRoutes.ts
│   │   ├── reflectionRoutes.ts
│   │   └── rewardsRoutes.ts
│   ├── services/        # Business logic
│   │   ├── cloudinaryService.ts
│   │   └── questEngineService.ts
│   ├── utils/           # Utility functions
│   │   └── generateToken.ts
│   └── index.ts         # Main application file
├── seed.ts              # Database seeding script
├── package.json
└── tsconfig.json
```

## 🔐 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NODE_ENV` | Environment (development/production) | Yes |
| `PORT` | Server port number | Yes |
| `MONGO_URI` | MongoDB connection string | Yes |
| `JWT_SECRET` | Secret key for JWT tokens | Yes |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | Yes |
| `CLOUDINARY_API_KEY` | Cloudinary API key | Yes |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | Yes |

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch
```

## 📦 Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run seed` - Seed database with demo data
- `npm test` - Run tests

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- CORS protection
- Input validation and sanitization
- Rate limiting (can be added)
- Secure file upload validation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, please open an issue in the repository or contact the development team. 