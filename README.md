# Hahovesh Emergency Response App

A mobile application for managing Har Nof Emergency Medical Teams, enabling efficient coordination of volunteer shifts, medical incident reporting, and team communication.

## 📱 Key Features

### 🚨 Event Management
- Quick reporting of medical emergencies
- Real-time tracking of volunteer arrivals at scene
- Automatic navigation to event location
- Live timer from event creation

### 📢 Messaging System
- Send messages to volunteers by role
- Urgent messages with special notifications
- Automatic distribution based on volunteer availability

### 👥 User Management
- Registration system with identity verification
- Permission management by roles (Volunteer, Commander, Admin)
- New user approval workflow

### 📊 Reports & Statistics
- Event summary reports
- Detailed medical data
- Response time tracking

### 🔐 Security & Privacy
- Secure user authentication
- Role-based access control

## 🛠 Technology Stack

### Frontend (React Native + Expo)
- **React Native** - Cross-platform mobile development
- **Expo** - Development and deployment platform
- **TypeScript** - Static typing for safer code
- **Tailwind CSS (TWRNC)** - Fast responsive styling

### Backend (Firebase)
- **Firebase Authentication** - User authentication
- **Cloud Firestore** - NoSQL database
- **Realtime Database** - Real-time data synchronization
- **Cloud Functions** - Server-side logic
- **Cloud Messaging** - Push notifications

### State Management
- **Context API** - Global state management
- **Custom Hooks** - Shared logic

## 🚀 Installation & Development

### Prerequisites
- Node.js (version 18 or higher)
- npm or yarn
- Expo CLI
- Android Studio (for Android development)
- Firebase project (firestore,database,auth,cloud functions)

### Project Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd Hahovesh
```

2. **Install dependencies**
```bash
npm install
```

3.**Setup environment variables**
```bash
cp .env.example .env
```
Edit the .env file and add your Firebase credentials. You can find these values in your Firebase Console under Project Settings > General > Your apps

4.**Setup Firebase Functions**
```bash
cd functions
npm install
firebase deploy --only functions
cd ..
```
5. **Run the application**
```bash
npx expo run:android
``

📁 Project Structure
Hahovesh/
├── app/                          # Application screens (Expo Router)
│   ├── (auth)/                   # Authentication screens
│   │   ├── login/                # Login and phone verification
│   │   └── register/             # New user registration
│   ├── (app)/                    # Main application screens
│   │   ├── home/                 # Home page
│   │   ├── ArrivingToEvent/      # Event arrival screen
│   │   ├── messages/             # Messages
│   │   ├── UserManagement/       # User management
│   │   ├── summaryReports/       # Summary reports
│   │   └── statistics/           # Statistics
│   └── _layout.tsx               # Main layout
├── components/                   # Shared components
├── hooks/                        # Context providers and custom hooks
├── services/                     # API calls and Firebase
├── data/                         # Schemas and configuration
├── assets/                       # Images and static files
└── .env.example                  # Environment variables example
functions/                    # Firebase Cloud Functions

👤 User Permissions
Permission Levels
1 - Volunteer - View events and report arrival
2 - Dispacher - Create events and send messages
3 - Admin - Full system management
User Approval Process
New user registers in the system
User receives "Pending" status
Admin approves and grants appropriate permissions
User gains access to the system
📱 Advanced Features
Smart Notifications
Custom notifications by user type
Different sounds for urgent messages
Local and remote notifications
Offline Mode
Local data caching
Automatic sync when connectivity returns
Basic operations available offline
Accessibility
Hebrew language support (RTL)
Adaptive font sizes
Screen reader support

📞 Support
For questions and support, contact the development team or open an issue on GitHub.

📄 License
This project is developed for Har Nof Emergency Medical Teams and is intended for organizational use only.