# Solo Sparks Frontend

A modern React application for personal growth and self-reflection. Built with TypeScript, Vite, and Tailwind CSS, featuring a beautiful glassmorphism UI with dark/light mode support.

## 🎯 Demo Access

**Demo Credentials:**
- **Email:** `diana@example.com`
- **Password:** `Password123!`

Use these credentials to explore the full application with pre-populated data including quests, reflections, personality profiles, and analytics.

## ✨ Features

- **🎨 Modern UI**: Glassmorphism design with neon accents and smooth animations
- **🌙 Dark/Light Mode**: Seamless theme switching with persistent preferences
- **📱 Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **🔐 Authentication**: Secure login/register with JWT token management
- **🎯 Quest System**: Daily quests with progress tracking and completion rewards
- **📝 Reflections**: Rich text reflections with image and audio uploads
- **🧠 Personality Profiling**: MBTI, Big Five, and Enneagram assessments
- **🏆 Rewards System**: Spark points and reward redemption
- **📊 Analytics**: Visual charts and progress tracking
- **⚡ Real-time Updates**: RTK Query for efficient data fetching and caching

## 🛠️ Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom glassmorphism components
- **State Management**: Zustand + RTK Query
- **Routing**: React Router v6
- **Icons**: Lucide React
- **Charts**: Recharts
- **File Upload**: Custom drag-and-drop components
- **UI Components**: Custom glassmorphism components

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager
- Backend server running (see backend README)

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Solo-Sparks/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the frontend root directory:
   ```env
   VITE_API_URL=http://localhost:5000/api
   VITE_APP_NAME=Solo Sparks
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:5173`

## 🚀 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## 🎨 UI Components

### Glassmorphism Components
- `GlassCard` - Primary container with glass effect
- `NeonGlowButton` - Buttons with neon glow effects
- `NeonProgressBar` - Animated progress bars
- `Modal` - Overlay modals with glass effect

### Form Components
- `LoginForm` / `RegisterForm` - Authentication forms
- `ReflectionForm` - Rich text reflection creation
- `FileUpload` - Drag-and-drop file upload

### Display Components
- `QuestDisplay` - Quest cards with progress
- `ReflectionList` - Reflection timeline
- `StatWidget` - Statistics display
- `EmptyState` - Empty state illustrations

## 📱 Pages & Features

### Authentication
- **Login/Register**: Unified auth page with form switching
- **Onboarding**: 5-step personality and preference setup
- **Profile Management**: User settings and preferences

### Main Features
- **Dashboard**: Overview with stats and quick actions
- **Quests**: Daily quests with filtering and completion
- **Reflections**: Journal entries with media attachments
- **Personality Profile**: MBTI, Big Five, and Enneagram insights
- **Analytics**: Charts showing mood trends and progress
- **Rewards**: Spark points and reward redemption
- **Settings**: Theme, account, and security settings

## 🗂️ Project Structure

```
frontend/
├── src/
│   ├── api/              # RTK Query API slices
│   │   ├── api.ts        # Base API configuration
│   │   ├── authApi.ts    # Authentication endpoints
│   │   ├── questApi.ts   # Quest management
│   │   ├── reflectionApi.ts # Reflection CRUD
│   │   ├── rewardsApi.ts # Rewards and points
│   │   └── profileApi.ts # User profile management
│   ├── components/       # Reusable components
│   │   ├── ui/          # Base UI components
│   │   ├── onboarding/  # Onboarding step components
│   │   ├── LoginForm.tsx
│   │   ├── ReflectionForm.tsx
│   │   └── Sidebar.tsx
│   ├── hooks/           # Custom React hooks
│   │   └── useAuth.ts
│   ├── pages/           # Page components
│   │   ├── AuthPage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── QuestsPage.tsx
│   │   ├── ReflectionsPage.tsx
│   │   ├── AnalyticsPage.tsx
│   │   └── RewardsPage.tsx
│   ├── store/           # State management
│   │   ├── authStore.ts # Authentication state
│   │   └── store.ts     # RTK Query store
│   ├── types/           # TypeScript type definitions
│   │   └── index.ts
│   ├── utils/           # Utility functions
│   │   ├── cn.ts        # Class name utilities
│   │   └── questUtils.ts # Quest-related utilities
│   ├── App.tsx          # Main app component
│   ├── main.tsx         # App entry point
│   └── ThemeContext.tsx # Theme management
├── public/              # Static assets
├── index.html           # HTML template
├── tailwind.config.js   # Tailwind configuration
├── vite.config.ts       # Vite configuration
└── tsconfig.json        # TypeScript configuration
```

## 🎨 Design System

### Colors
- **Primary**: Indigo/Cyan gradients
- **Accent**: Green/Teal for success states
- **Secondary**: Purple/Pink for highlights
- **Neutral**: Gray scale for text and backgrounds

### Typography
- **Headings**: Bold, gradient text with neon effects
- **Body**: Clean, readable fonts with proper contrast
- **Code**: Monospace for technical content

### Animations
- **Hover Effects**: Glow effects and scale transforms
- **Loading States**: Smooth spinners and skeleton screens
- **Transitions**: 300ms ease-in-out for all interactions

## 🔐 Authentication Flow

1. **Login/Register**: Users can create accounts or log in
2. **Onboarding**: New users complete 5-step personality setup
3. **JWT Management**: Automatic token refresh and secure storage
4. **Protected Routes**: Authentication required for main features

## 📊 Data Management

- **RTK Query**: Efficient API calls with caching
- **Optimistic Updates**: Immediate UI feedback
- **Error Handling**: Graceful error states and retry mechanisms
- **Offline Support**: Basic offline functionality with cached data

## 🎯 Key Features Explained

### Quest System
- Daily quests with different categories
- Progress tracking with visual indicators
- Completion rewards and spark points
- Reflection integration

### Personality Profiling
- MBTI type assessment
- Big Five personality traits
- Enneagram integration
- Visual progress indicators

### Analytics Dashboard
- Mood tracking over time
- Spark points growth
- Quest completion trends
- Interactive charts with Recharts

### Rewards System
- Spark points earned from activities
- Reward categories (boost, content, achievement, etc.)
- Redemption history
- Point balance tracking

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel
```bash
npm install -g vercel
vercel
```

### Deploy to Netlify
```bash
npm run build
# Upload dist/ folder to Netlify
```

## 🔧 Configuration

### Environment Variables
| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:5000/api` |
| `VITE_APP_NAME` | Application name | `Solo Sparks` |

### Tailwind Configuration
Custom glassmorphism utilities and color schemes are defined in `tailwind.config.js`.

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

## 🙏 Acknowledgments

- **Icons**: Lucide React
- **Charts**: Recharts
- **UI Inspiration**: Modern glassmorphism design trends
- **Color Palette**: Carefully selected for accessibility and aesthetics
