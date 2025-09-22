import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, Alert } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useDispatch, useSelector } from 'react-redux';
import CustomInput from '../components/Input';
import CustomButton from '../components/Button';
import { loginUser, clearError } from '../store/slices/userSlice';
import { RootState, AppDispatch } from '../store';
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

export default function Login({ navigation }: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, currentUser } = useSelector((state: RootState) => state.users);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);

  useEffect(() => {
    if (currentUser && !loading && !error) {
      navigation.replace('Dashboard');
    }
  }, [currentUser, loading, error, navigation]);

  useEffect(() => {
    if (error) {
      console.log('Login error displayed:', error);
      Alert.alert('Login Failed', error);
      dispatch(clearError()); 
    }
  }, [error, dispatch]);

  const handleLogin = async () => {
    console.log('Attempting login with:', { email });
    dispatch(clearError());
    try {
      const result = await dispatch(loginUser({ email, password })).unwrap();
      console.log('Login result:', result);
    } catch (err) {
      console.error('Login dispatch error:', err);
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
        secureTextEntry={!showPassword}
        rightIcon={showPassword ? 'eye-slash' : 'eye'}
        onRightIconPress={() => setShowPassword(!showPassword)}
      />
      <CustomButton
        title="Login"
        onPress={handleLogin}
        icon="sign-in"
        disabled={loading}
      />
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
    flex: 0.925,
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
  },
});