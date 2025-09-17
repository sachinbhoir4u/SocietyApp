import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
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

export default function Registration({ navigation }: Props) {
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
      <CustomButton title="Register" onPress={handleRegister} />
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
});