import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesome } from '@expo/vector-icons';
import CustomInput from '../components/Input';
import CustomButton from '../components/Button';
import { registerUser } from '../store/slices/userSlice';
import { RootState, AppDispatch } from '../store';
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
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [flatNumber, setFlatNumber] = useState<string>('');
  const [wing, setWing] = useState<string>('');
  const [floor, setFloor] = useState<string>('');
  const [emergencyContact, setEmergencyContact] = useState<string>('');
  const [vehicleDetails, setVehicleDetails] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.users);

  const handlePhoneChange = (text: string) => {
    // Allow only digits and limit to 10 characters
    const numericText = text.replace(/[^0-9]/g, '').slice(0, 10);
    setPhone(numericText);
  };

  const handleRegister = async () => {
    try {
      // Validate required fields
      if (!name || !email || !password || !phone || !flatNumber || !wing || !floor) {
        alert('Please fill in all required fields');
        return;
      }

      // Validate phone number length
      if (phone.length !== 10) {
        alert('Phone number must be exactly 10 digits');
        return;
      }

      const userData = {
        name,
        email,
        password,
        phone,
        flatNumber,
        wing,
        floor,
        emergencyContact: emergencyContact || undefined,
        vehicleDetails: vehicleDetails || undefined,
      };

      await dispatch(registerUser(userData)).unwrap();
      alert('Registration successful! Please check your email for verification.');
      navigation.navigate('Login');
    } catch (err: any) {
      alert(error || 'Registration failed. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/logo-blc.png')}
        style={styles.mainLogo}
      />
      <Text style={styles.title}>Register</Text>
      {loading && <ActivityIndicator size="large" color={COLORS.primary} />}
      {error && <Text style={styles.errorText}>{error}</Text>}
      <CustomInput
        placeholder="Full Name"
        icon="user"
        value={name}
        onChangeText={setName}
      />
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
        secureTextEntry={!showPassword}
        rightIcon={showPassword ? 'eye-slash' : 'eye'}
        onRightIconPress={() => setShowPassword(!showPassword)}
      />
      <CustomInput
        placeholder="Phone Number"
        icon="phone"
        value={phone}
        onChangeText={handlePhoneChange}
        keyboardType="phone-pad"
        maxLength={10}
      />
      <CustomInput
        placeholder="Flat Number"
        icon="home"
        value={flatNumber}
        onChangeText={setFlatNumber}
      />
      <View style={styles.rowContainer}>
        <View style={styles.inputWrapper}>
          <CustomInput
            placeholder="Wing"
            icon="building"
            value={wing}
            onChangeText={setWing}
          />
        </View>
        <View style={styles.inputWrapper}>
          <CustomInput
            placeholder="Floor"
            icon="sort-numeric-up"
            value={floor}
            onChangeText={setFloor}
            keyboardType="numeric"
          />
        </View>
      </View>
      {/* <CustomInput
        placeholder="Emergency Contact (Optional)"
        icon="phone-alt"
        value={emergencyContact}
        onChangeText={setEmergencyContact}
        keyboardType="phone-pad"
      />
      <CustomInput
        placeholder="Vehicle Details (Optional)"
        icon="car"
        value={vehicleDetails}
        onChangeText={setVehicleDetails}
      /> */}
      <CustomButton
        title="Register"
        onPress={handleRegister}
        icon="user-plus"
        disabled={loading}
      />
      <CustomButton
        title="Back to Login"
        onPress={() => navigation.navigate('Login')}
        style={styles.outlineButton}
        titleStyle={styles.outlineButtonTitle}
        disabled={loading}
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
  errorText: {
    color: COLORS.error || 'red',
    textAlign: 'center',
    marginBottom: SIZES.margin,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.primary,
    marginTop: SIZES.margin,
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
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SIZES.margin,
  },
  inputWrapper: {
    flex: 1,
    marginHorizontal: SIZES.margin / 2,
  },
});