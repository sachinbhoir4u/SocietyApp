import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, TextInput } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import RazorpayCheckout, { RazorpayPaymentResult } from 'react-native-razorpay';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type RootStackParamList = {
  Dashboard: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, 'Payment'>;

interface PaymentType {
  label: string;
  value: string;
  defaultAmount: number;
}

const paymentTypes: PaymentType[] = [
  { label: 'Society Maintenance', value: 'maintenance', defaultAmount: 1000 },
  { label: 'Amenity Booking (Function Hall)', value: 'amenity_booking', defaultAmount: 5000 },
  { label: 'Gym Membership', value: 'gym', defaultAmount: 2000 },
  { label: 'Custom Amount', value: 'custom', defaultAmount: 0 },
];

const Payment: React.FC<Props> = ({ navigation }) => {
  const [selectedPaymentType, setSelectedPaymentType] = useState<string>('maintenance');
  const [amount, setAmount] = useState<number>(1000); // Default amount in INR
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handlePaymentTypeChange = (value: string) => {
    setSelectedPaymentType(value);
    const type = paymentTypes.find(pt => pt.value === value);
    if (type && type.defaultAmount > 0) {
      setAmount(type.defaultAmount);
    } else if (value === 'custom') {
      setAmount(0); // User will input custom
    }
  };

  const initiatePayment = () => {
    if (selectedPaymentType === 'custom' && amount <= 0) {
      Alert.alert('Error', 'Please enter a valid amount greater than 0.');
      return;
    }

    setIsLoading(true);

    const options = {
      description: `Payment for ${paymentTypes.find(pt => pt.value === selectedPaymentType)?.label || 'Custom'}`,
      image: 'https://your-app-logo-url.com/logo.png', // Replace with your app logo URL
      currency: 'INR',
      key: 'rzp_test_your_key_here', // Replace with your Razorpay test/live key
      amount: amount * 100, // Amount in paise (INR * 100)
      name: 'Society App',
      prefill: {
        email: 'user@example.com', // Replace with dynamic user email
        contact: '9999999999', // Replace with dynamic user phone
      },
      theme: {
        color: '#007AFF',
      },
      modal: {
        ondismiss: () => {
          setIsLoading(false);
          Alert.alert('Payment Cancelled', 'You cancelled the payment.');
        },
      },
    };

    RazorpayCheckout.open(options)
      .then((data: RazorpayPaymentResult) => {
        setIsLoading(false);
        Alert.alert('Success', `Payment ID: ${data.razorpay_payment_id}\nTransaction ID: ${data.razorpay_order_id || 'N/A'}`);
        // Send data to backend for verification
        navigation.navigate('Dashboard');
      })
      .catch((error: any) => {
        setIsLoading(false);
        Alert.alert('Payment Failed', error.description || 'Payment failed. Please try again.');
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Make Payment</Text>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Select Payment Type:</Text>
        <Picker
          selectedValue={selectedPaymentType}
          onValueChange={handlePaymentTypeChange}
          style={styles.picker}
        >
          {paymentTypes.map(type => (
            <Picker.Item key={type.value} label={type.label} value={type.value} />
          ))}
        </Picker>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Amount (INR):</Text>
        {selectedPaymentType === 'custom' ? (
          <TextInput
            style={styles.input}
            value={amount.toString()}
            onChangeText={(text) => setAmount(parseInt(text) || 0)}
            placeholder="Enter amount"
            keyboardType="numeric"
          />
        ) : (
          <Text style={styles.amountText}>₹{amount}</Text>
        )}
      </View>

      <TouchableOpacity
        style={[styles.button, isLoading && styles.buttonDisabled]}
        onPress={initiatePayment}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>{isLoading ? 'Processing...' : 'Pay Now'}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate('Dashboard')}
      >
        <Text style={styles.backButtonText}>Back to Dashboard</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f5f5f5' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  formGroup: { marginBottom: 16 },
  label: { fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
  picker: { backgroundColor: '#fff', borderRadius: 8, height: 50 },
  input: { backgroundColor: '#fff', padding: 12, borderRadius: 8, fontSize: 16 },
  amountText: { backgroundColor: '#fff', padding: 12, borderRadius: 8, fontSize: 16, textAlign: 'center' },
  button: { backgroundColor: '#007AFF', padding: 12, borderRadius: 8, alignItems: 'center', marginTop: 16 },
  buttonDisabled: { backgroundColor: '#ccc' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  backButton: { backgroundColor: '#6c757d', padding: 12, borderRadius: 8, alignItems: 'center', marginTop: 8 },
  backButtonText: { color: '#fff', fontSize: 16 },
});

export default Payment;