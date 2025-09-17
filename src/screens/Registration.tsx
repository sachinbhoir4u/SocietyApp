import React, { useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import CustomInput from '../components/Input';
import CustomButton from '../components/Button';
import { apiRegister } from '../utils/api';
import { COLORS, SIZES } from '../utils/constants';

type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Dashboard: undefined;
};

type RegisterScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Register'>;

interface Props {
  navigation: RegisterScreenNavigationProp;
}

export default function Register({ navigation }: Props) {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [flatNumber, setFlatNumber] = useState<string>('');

  const handleRegister = async () => {
    try {
      await apiRegister({ email, password, flatNumber });
      alert('Registration successful! Please login.');
      navigation.navigate('Login');
    } catch (error: any) {
      alert('Registration failed: ' + error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/logo-blc.png')}
        style={styles.mainLogo}
      />
      <Text style={styles.title}>Register</Text>
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
      <CustomInput
        placeholder="Flat Number"
        icon="home"
        value={flatNumber}
        onChangeText={setFlatNumber}
      />
      <CustomButton title="Register" onPress={handleRegister} icon="user-plus" />
      <CustomButton
        title="Back to Login"
        onPress={() => navigation.navigate('Login')}
        style={styles.outlineButton}
        titleStyle={styles.outlineButtonTitle}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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