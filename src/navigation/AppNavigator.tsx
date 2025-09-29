import React, { useEffect, useRef } from 'react';
import { NavigationContainer, NavigationContainerRef } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Image, View, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import Login from '../screens/Login';
import Registration from '../screens/Registration';
import Dashboard from '../screens/Dashboard';
import Payment from '../screens/Payment';
import { COLORS } from '../utils/constants';
import { checkAuth } from '../store/slices/userSlice';
import { RootState, AppDispatch } from '../store';

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Dashboard: undefined;
  Payment: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, loading } = useSelector((state: RootState) => state.users);
  const navigationRef = useRef<NavigationContainerRef<RootStackParamList>>(null);

  useEffect(() => {
    dispatch(checkAuth()).then(() => {
      if (navigationRef.current) {
        navigationRef.current.reset({
          index: 0,
          routes: [{ name: isAuthenticated ? 'Dashboard' : 'Login' }],
        });
      }
    });
  }, [dispatch]);

  if (loading) {
    return (
      <View style={styles.splashContainer}>
        <Image
          source={require('../../assets/logo.png')}
          style={styles.splashLogo}
        />
      </View>
    );
  }

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: COLORS.primary },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
          headerTitleAlign: 'center',
          headerLeft: () => null,
          headerTitle: () => (
            <Image
              source={require('../../assets/logo.png')}
              style={{ width: 80, height: 60, resizeMode: 'contain' }}
            />
          ),
        }}
      >
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={Registration} options={{ headerShown: false }} />
        <Stack.Screen name="Dashboard" component={Dashboard} />
        <Stack.Screen name="Payment" component={Payment} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  splashLogo: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
  },
});



// import React from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createStackNavigator } from '@react-navigation/stack';
// import { Image } from 'react-native';
// import Login from '../screens/Login';
// import Registration from '../screens/Registration';
// import Dashboard from '../screens/Dashboard';
// import Payment from '../screens/Payment';
// import { COLORS } from '../utils/constants';

// type RootStackParamList = {
//   Login: undefined;
//   Register: undefined;
//   Dashboard: undefined;
//   Payment: undefined;
// };

// const Stack = createStackNavigator<RootStackParamList>();

// export default function AppNavigator() {
//   return (
//     <NavigationContainer>
//       <Stack.Navigator
//         initialRouteName="Login"
//         screenOptions={{
//           headerStyle: { backgroundColor: COLORS.primary },
//           headerTintColor: '#fff',
//           headerTitleStyle: { fontWeight: 'bold' },
//           headerTitleAlign: 'center',
//           headerLeft: () => null,
//           headerTitle: () => (
//             <Image
//               source={require('../../assets/logo.png')}
//               style={{ width: 80, height: 60, resizeMode: 'contain' }}
//             />
//           ),
//         }}
//       >
//         <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
//         <Stack.Screen name="Register" component={Registration} options={{ headerShown: false }} />
//         <Stack.Screen name="Dashboard" component={Dashboard} />
//         <Stack.Screen name="Payment" component={Payment} />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }






// import React, { useEffect } from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createStackNavigator } from '@react-navigation/stack';
// import { Image } from 'react-native';
// import { useSelector, useDispatch } from 'react-redux';
// import Login from '../screens/Login';
// import Registration from '../screens/Registration';
// import Dashboard from '../screens/Dashboard';
// import Payment from '../screens/Payment';
// import { COLORS } from '../utils/constants';
// import { checkAuth } from '../store/slices/userSlice';
// import { RootState, AppDispatch } from '../store';

// export type RootStackParamList = {
//   Login: undefined;
//   Register: undefined;
//   Dashboard: undefined;
//   Payment: undefined;
// };

// const Stack = createStackNavigator<RootStackParamList>();

// export default function AppNavigator() {
//   const dispatch = useDispatch<AppDispatch>();
//   const { isAuthenticated, loading } = useSelector((state: RootState) => state.users);

//   useEffect(() => {
//     dispatch(checkAuth());
//   }, [dispatch]);

//   if (loading) {
//     return null; // Optionally render a splash screen
//   }

//   return (
//     <NavigationContainer>
//       <Stack.Navigator
//         initialRouteName="Login"
//         screenOptions={{
//           headerStyle: { backgroundColor: COLORS.primary },
//           headerTintColor: '#fff',
//           headerTitleStyle: { fontWeight: 'bold' },
//           headerTitleAlign: 'center',
//           headerLeft: () => null,
//           headerTitle: () => (
//             <Image
//               source={require('../../assets/logo.png')}
//               style={{ width: 80, height: 60, resizeMode: 'contain' }}
//             />
//           ),
//         }}
//       >
//         {isAuthenticated ? (
//           <>
//             <Stack.Screen name="Dashboard" component={Dashboard} />
//             <Stack.Screen name="Payment" component={Payment} />
//           </>
//         ) : (
//           <>
//             <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
//             <Stack.Screen name="Register" component={Registration} options={{ headerShown: false }} />
//           </>
//         )}
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }