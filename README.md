SocietyApp
A React Native (Expo) app with TypeScript for a cooperative society, allowing flat owners to log in and register.
Features

User authentication (login/registration)
TypeScript support for type safety
Expo-managed workflow for cross-platform development
Optimized for Expo Go

Setup

Clone the repository:git clone https://github.com/YOUR_USERNAME/SocietyApp.git
cd SocietyApp

Install dependencies:npx expo install

Run the app:npx expo start

Scan the QR code with the Expo Go app (iOS/Android) or run on a simulator.

Folder Structure

src/components/: Reusable UI components (Button, Input)
src/context/: State management with Context API
src/navigation/: Navigation setup with React Navigation
src/screens/: Screen components (Login, Register)
src/utils/: API helpers and constants

Dependencies

@react-navigation/native
@react-navigation/stack
@expo/vector-icons
axios
expo-router
react-native-gesture-handler
react-native-reanimated
react-native-screens

Next Steps

Add backend APIs for authentication.
Implement additional screens (Dashboard, Payments, Notices).
Integrate payment gateways (e.g., Razorpay, requires custom build).
Enhance UI with custom styles or Tailwind CSS via nativewind.
