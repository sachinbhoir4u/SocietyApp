// import React from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createStackNavigator } from '@react-navigation/stack';
// import Login from '../screens/Login';
// import Registration from '../screens/Registration';
// import { COLORS } from '../utils/constants';

// type RootStackParamList = {
//   Login: undefined;
//   Register: undefined;
//   Dashboard: undefined;
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
//         }}
//       >
//         <Stack.Screen name="Login" component={Login} options={{ title: 'Society App' }} />
//         <Stack.Screen name="Register" component={Registration} options={{ title: 'Register' }} />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }


import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Image } from 'react-native';
import Login from '../screens/Login';
import Registration from '../screens/Registration';
import { COLORS } from '../utils/constants';

type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Dashboard: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerStyle: { backgroundColor: COLORS.primary },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
          headerTitle: () => (
            <Image
              source={require('../../assets/logo.png')}
              style={{ width: 80, height: 60, resizeMode: 'contain' }}
            />
          ),
        }}
      >
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Registration} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}