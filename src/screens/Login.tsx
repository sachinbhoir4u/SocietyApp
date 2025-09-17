import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { UserContext } from '../context/UserContext';
import CustomInput from '../components/Input';
import CustomButton from '../components/Button';
import { apiLogin } from '../utils/api';
import { COLORS, SIZES } from '../utils/constants';

type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Dashboard: undefined;
};

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

interface Props {
  navigation: LoginScreenNavigationProp;
}

interface User {
  email: string;
  flatNumber: string;
}

export default function Login({ navigation }: Props) {
  const { setUser } = useContext(UserContext);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleLogin = async () => {
    try {
      const response = await apiLogin({ email, password });
      setUser({ email, flatNumber: response.flatNumber || 'A-101' });
      navigation.replace('Dashboard'); // Use replace to prevent going back to Login
    } catch (error: any) {
      alert('Login failed: ' + error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/logo-blc.png')}
        style={styles.mainLogo}
      />
      <Text style={styles.title}>Login</Text>
      <CustomInput
        placeholder="Email"
        icon="envelope"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <CustomInput
        placeholder="Password"
        icon="lock"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <CustomButton title="Login" onPress={handleLogin} icon="sign-in" />
      <CustomButton
        title="Register"
        onPress={() => navigation.navigate('Register')}
        style={styles.outlineButton}
        titleStyle={styles.outlineButtonTitle}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: .925,
    padding: SIZES.padding,
    backgroundColor: COLORS.secondary,
    justifyContent: 'center',
  },
  title: {
    fontSize: SIZES.title,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: SIZES.margin * 2,
    color: COLORS.primary,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  outlineButtonTitle: {
    color: COLORS.primary,
  },
  mainLogo: {
    width: 100,
    height: 90,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: SIZES.margin * 2,
    backgroundColor: '#e1eefd',
    padding: 10,
    borderRadius: 10,
  }
});