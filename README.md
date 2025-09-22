# SocietyApp

A cross-platform mobile application for a cooperative housing society, built with **React Native**, **Expo**, and **TypeScript**. The app enables flat owners to register, log in, make payments, view notices, raise complaints, and more. Optimized for the Expo-managed workflow and compatible with **Expo Go** for seamless iOS and Android development.

## Overview

`SocietyApp` is a mobile application designed for residents of a cooperative housing society. It provides a user-friendly interface for flat owners to manage society-related tasks, such as viewing notices, making maintenance payments, and raising complaints. The app uses **React Native** with **TypeScript** for type safety, **Expo** for rapid development and cross-platform support, and integrates with a backend API (e.g., `society-backend`) for data management.

## Features

- **User Authentication**: Secure registration and login for flat owners using JWT-based authentication.
- **Payments**: View and make maintenance or event-related payments.(in progress)
- **Notices**: Access society-wide announcements and updates.(in progress)
- **Complaints**: Raise and track complaints for society maintenance or issues.(in progress)
- **Type Safety**: TypeScript ensures robust and maintainable code.
- **Cross-Platform**: Runs on iOS and Android via Expo Go.
- **Responsive UI**: Reusable components for a consistent user experience.

## Technologies

- **React Native**: Framework for building cross-platform mobile apps.
- **Expo**: Managed workflow for simplified development and deployment.
- **TypeScript**: Adds type safety to JavaScript for better code reliability.
- **React Navigation**: For navigation between screens (stack and tab navigators).
- **Axios**: For making API requests to the backend.
- **Expo Router**: For file-based routing (optional, if used).

## Prerequisites

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **Expo CLI**: Install globally with `npm install -g expo-cli`
- **Expo Go App**: Download on iOS or Android for testing.
- **Git**: For cloning the repository.
- **Backend API**: A running instance of a backend (e.g., `society-backend`) for authentication and data.

## Setup

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/sachinbhoir4u/SocietyApp.git
   cd SocietyApp
   ```

2. **Install Dependencies**:

   ```bash
   npm install
   ```

   or

   ```bash
   yarn install
   ```

3. **Set Up Environment Variables**:
   Create a `.env` file in the root directory and add the backend API URL:

   ```env
   e.g. API_URL=http://your-backend-url:3000/api
   ```

4. **Ensure Backend is Running**:
   Make sure the backend API (e.g., `society-backend`) is running and accessible at the `API_URL` specified in `.env`.

## Folder Structure

```plaintext
SocietyApp/
├── src/
│   ├── components/        # Reusable UI components (e.g., Button, Input)
│   ├── context/           # Context API for state management (e.g., AuthContext)
│   ├── navigation/        # Navigation setup with React Navigation
│   ├── screens/           # Screen components (e.g., LoginScreen, RegisterScreen)
│   ├── utils/             # API helpers, constants, and utility functions
│   └── types/             # TypeScript type definitions
├── .env                   # Environment variables (e.g., API_URL)
├── app.json               # Expo configuration
├── package.json           # Project dependencies and scripts
└── README.md              # Project documentation
```

## Dependencies

- `@react-navigation/native`: Navigation library for screen transitions.
- `@react-navigation/stack`: Stack navigator for authentication flows.
- `@expo/vector-icons`: Icon library for UI elements.
- `axios`: HTTP client for API requests.
- `typescript`: Type safety for JavaScript code.
- `expo`: Core Expo SDK for managed workflow.

Install dependencies using:

```bash
npx expo install @react-navigation/native @react-navigation/stack @expo/vector-icons axios expo-router
```

## Environment Variables

Create a `.env` file in the root directory with the following:

```env
API_URL=http://your-backend-url:3000/api
```

- `API_URL`: The base URL of the backend API (e.g., `http://localhost:3000/api` for local development).

**Note**: Ensure the backend API is configured with the same `JWT_SECRET` as used in the backend (e.g., `a4f9c2b7e8d3a1f6c9b2e7f4d1a8c3e9f2b7d4a1c8e3f9b2a7d4c1e8f3a9b2c7`).

## Running the App

1. **Start the Development Server**:

   ```bash
   npx expo start
   ```

2. **Run on Device/Simulator**:

   - **Expo Go**: Open the Expo Go app on your iOS/Android device and scan the QR code displayed in the terminal or browser.
   - **iOS Simulator**: Press `i` in the terminal (requires Xcode on macOS).
   - **Android Emulator**: Press `a` in the terminal (requires Android Studio).
   - **Web**: Press `w` to run in a browser (limited functionality).

3. **Test the App**:
   - Register a new user or log in using credentials from the backend.
   - Ensure the backend API is running and accessible.

## Authentication

The app uses JWT-based authentication:

- **Registration**: Users can sign up with an email, password, and other details via the `/api/auth/register` endpoint.
- **Login**: Users log in via the `/api/auth/login` endpoint, receiving a JWT stored in the app (e.g., using AsyncStorage or Context API).
- **Protected Routes**: Screens like Payments and Complaints require a valid JWT, sent in the `Authorization` header as `Bearer <token>`.

Example API request (using Axios):

```typescript
import axios from "axios";

const login = async (email: string, password: string) => {
  const response = await axios.post(`${process.env.API_URL}/auth/login`, {
    email,
    password,
  });
  return response.data.token;
};
```

## Contributing

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature`).
3. Make changes and commit (`git commit -m "Add your feature"`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a Pull Request.

Please ensure code follows TypeScript conventions and includes appropriate tests.
