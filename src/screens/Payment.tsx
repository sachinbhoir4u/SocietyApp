import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, TextInput, FlatList } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import RazorpayCheckout, { RazorpayPaymentResult } from 'react-native-razorpay';
import { useDispatch, useSelector } from 'react-redux';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { getPendingBills, makePayment } from '../store/slices/paymentSlice'; // Adjust path
import { RootState, AppDispatch } from '../store'; // Adjust path to your Redux store

type RootStackParamList = {
  Dashboard: undefined;
  Payment: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, 'Payment'>;

interface PaymentType {
  label: string;
  value: string;
  defaultAmount: number;
}

interface Bill {
  _id: string;
  type: string;
  amount: number; // In paise
  description: string;
  dueDate: string;
}

const paymentTypes: PaymentType[] = [
  { label: 'Society Maintenance', value: 'maintenance', defaultAmount: 1000 },
  { label: 'Amenity Booking (Function Hall)', value: 'amenity_booking', defaultAmount: 5000 },
  { label: 'Gym Membership', value: 'gym', defaultAmount: 2000 },
  { label: 'Custom Amount', value: 'custom', defaultAmount: 0 },
];

const Payment: React.FC<Props> = ({ navigation }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { bills, loading } = useSelector((state: RootState) => state.payments);
  const { token, currentUser } = useSelector((state: RootState) => state.users); // Assume auth slice
  const [selectedPaymentType, setSelectedPaymentType] = useState<string>('maintenance');
  const [amount, setAmount] = useState<number>(1000); // Default amount in INR
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    dispatch(getPendingBills());
  }, [dispatch]);

  const handlePaymentTypeChange = (value: string) => {
    setSelectedPaymentType(value);
    setSelectedBill(null); // Clear selected bill when changing type
    const type = paymentTypes.find(pt => pt.value === value);
    if (type && type.defaultAmount > 0) {
      setAmount(type.defaultAmount);
    } else if (value === 'custom') {
      setAmount(0);
    }
  };

  const handleBillSelect = (bill: Bill) => {
    setSelectedBill(bill);
    setSelectedPaymentType(bill.type);
    setAmount(bill.amount / 100); // Convert paise to INR
  };

  const initiatePayment = async () => {
    if (selectedPaymentType === 'custom' && amount <= 0) {
      Alert.alert('Error', 'Please enter a valid amount greater than 0.');
      return;
    }

    setIsLoading(true);

    try {
      let orderResponse;
      if (selectedBill) {
        // Pay for selected bill
        orderResponse = await dispatch(makePayment({
          billId: selectedBill._id,
          amount: selectedBill.amount // Already in paise
        })).unwrap();
      } else {
        // Pay for custom or predefined type
        orderResponse = await dispatch(makePayment({
          amount: amount * 100, // Convert INR to paise
          type: selectedPaymentType,
          description: `Payment for ${paymentTypes.find(pt => pt.value === selectedPaymentType)?.label || 'Custom'}`,
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
          month: (new Date().getMonth() + 1).toString().padStart(2, '0'),
          year: new Date().getFullYear().toString()
        })).unwrap();
      }

      if (!orderResponse.success) {
        throw new Error(orderResponse.error || 'Failed to create payment order');
      }

      const options = {
        description: selectedBill ? selectedBill.description : `Payment for ${paymentTypes.find(pt => pt.value === selectedPaymentType)?.label || 'Custom'}`,
        image: 'https://your-app-logo-url.com/logo.png', // Replace with your app logo URL
        currency: 'INR',
        key: 'rzp_test_your_key_here', // Replace with your Razorpay test key
        amount: selectedBill ? selectedBill.amount : amount * 100, // In paise
        name: 'Society App',
        order_id: orderResponse.data.razorpayOrder.id, // From backend
        prefill: {
          email: currentUser?.email || 'user@example.com',
          contact: currentUser?.phone || '9999999999',
        },
        theme: { color: '#007AFF' },
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
          Alert.alert('Success', `Payment ID: ${data.razorpay_payment_id}\nOrder ID: ${data.razorpay_order_id}`);
          // Call backend to verify payment
          verifyPayment(data);
        })
        .catch((error: any) => {
          setIsLoading(false);
          Alert.alert('Payment Failed', error.description || 'Payment failed. Please try again.');
        });
    } catch (error: any) {
      setIsLoading(false);
      Alert.alert('Error', error.message || 'Failed to initiate payment.');
    }
  };

  const verifyPayment = async (data: RazorpayPaymentResult) => {
    try {
        console.log("Verifying payment with data:", data);
      const response = await fetch('http://localhost:5001/api/payments/verify-razorpay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          razorpay_order_id: data.razorpay_order_id,
          razorpay_payment_id: data.razorpay_payment_id,
          razorpay_signature: data.razorpay_signature,
        }),
      });
      const result = await response.json();
      if (result.success) {
        Alert.alert('Success', 'Payment verified successfully!');
        navigation.navigate('Dashboard');
      } else {
        Alert.alert('Error', result.message || 'Payment verification failed.');
      }
    } catch (error: any) {
      Alert.alert('Error', 'Failed to verify payment: ' + error.message);
    }
  };

  const renderBill = ({ item }: { item: Bill }) => (
    <TouchableOpacity
      style={[styles.billItem, selectedBill?._id === item._id && styles.billItemSelected]}
      onPress={() => handleBillSelect(item)}
    >
      <Text style={styles.billText}>Type: {item.type.toUpperCase()}</Text>
      <Text style={styles.billText}>Amount: ₹{(item.amount / 100).toFixed(2)}</Text>
      <Text style={styles.billText}>Description: {item.description}</Text>
      <Text style={styles.billText}>Due: {new Date(item.dueDate).toLocaleDateString()}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Make Payment</Text>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Pending Bills:</Text>
        {loading ? (
          <Text style={styles.loadingText}>Loading bills...</Text>
        ) : bills.length === 0 ? (
          <Text style={styles.noBillsText}>No pending bills</Text>
        ) : (
          <FlatList
            data={bills}
            renderItem={renderBill}
            keyExtractor={(item) => item._id}
            style={styles.billList}
          />
        )}
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Select Payment Type:</Text>
        <Picker
          selectedValue={selectedPaymentType}
          onValueChange={handlePaymentTypeChange}
          style={styles.picker}
          enabled={!selectedBill} // Disable if a bill is selected
        >
          {paymentTypes.map(type => (
            <Picker.Item key={type.value} label={type.label} value={type.value} />
          ))}
        </Picker>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Amount (INR):</Text>
        {selectedPaymentType === 'custom' && !selectedBill ? (
          <TextInput
            style={styles.input}
            value={amount.toString()}
            onChangeText={(text) => setAmount(parseInt(text) || 0)}
            placeholder="Enter amount"
            keyboardType="numeric"
          />
        ) : (
          <Text style={styles.amountText}>₹{(selectedBill ? selectedBill.amount / 100 : amount).toFixed(2)}</Text>
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
  billList: { maxHeight: 200, backgroundColor: '#fff', borderRadius: 8, padding: 8 },
  billItem: { padding: 12, borderBottomWidth: 1, borderBottomColor: '#eee' },
  billItemSelected: { backgroundColor: '#e0f7fa' },
  billText: { fontSize: 14, marginBottom: 4 },
  loadingText: { fontSize: 16, textAlign: 'center', color: '#666' },
  noBillsText: { fontSize: 16, textAlign: 'center', color: '#666' },
});

export default Payment;




// import React, { useState } from 'react';
// import { View, Text, StyleSheet, TouchableOpacity, Alert, TextInput } from 'react-native';
// import { Picker } from '@react-native-picker/picker';
// import RazorpayCheckout, { RazorpayPaymentResult } from 'react-native-razorpay';
// import { NativeStackScreenProps } from '@react-navigation/native-stack';

// type RootStackParamList = {
//   Dashboard: undefined;
// };

// type Props = NativeStackScreenProps<RootStackParamList, 'Payment'>;

// interface PaymentType {
//   label: string;
//   value: string;
//   defaultAmount: number;
// }

// const paymentTypes: PaymentType[] = [
//   { label: 'Society Maintenance', value: 'maintenance', defaultAmount: 1000 },
//   { label: 'Amenity Booking (Function Hall)', value: 'amenity_booking', defaultAmount: 5000 },
//   { label: 'Gym Membership', value: 'gym', defaultAmount: 2000 },
//   { label: 'Custom Amount', value: 'custom', defaultAmount: 0 },
// ];

// const Payment: React.FC<Props> = ({ navigation }) => {
//   const [selectedPaymentType, setSelectedPaymentType] = useState<string>('maintenance');
//   const [amount, setAmount] = useState<number>(1000); // Default amount in INR
//   const [isLoading, setIsLoading] = useState<boolean>(false);

//   const handlePaymentTypeChange = (value: string) => {
//     setSelectedPaymentType(value);
//     const type = paymentTypes.find(pt => pt.value === value);
//     if (type && type.defaultAmount > 0) {
//       setAmount(type.defaultAmount);
//     } else if (value === 'custom') {
//       setAmount(0); // User will input custom
//     }
//   };

//   const initiatePayment = () => {
//     if (selectedPaymentType === 'custom' && amount <= 0) {
//       Alert.alert('Error', 'Please enter a valid amount greater than 0.');
//       return;
//     }

//     setIsLoading(true);

//     const options = {
//       description: `Payment for ${paymentTypes.find(pt => pt.value === selectedPaymentType)?.label || 'Custom'}`,
//       image: 'https://your-app-logo-url.com/logo.png', // Replace with your app logo URL
//       currency: 'INR',
//       key: 'rzp_test_your_key_here', // Replace with your Razorpay test/live key
//       amount: amount * 100, // Amount in paise (INR * 100)
//       name: 'Society App',
//       prefill: {
//         email: 'user@example.com', // Replace with dynamic user email
//         contact: '9999999999', // Replace with dynamic user phone
//       },
//       theme: {
//         color: '#007AFF',
//       },
//       modal: {
//         ondismiss: () => {
//           setIsLoading(false);
//           Alert.alert('Payment Cancelled', 'You cancelled the payment.');
//         },
//       },
//     };

//     RazorpayCheckout.open(options)
//       .then((data: RazorpayPaymentResult) => {
//         setIsLoading(false);
//         Alert.alert('Success', `Payment ID: ${data.razorpay_payment_id}\nTransaction ID: ${data.razorpay_order_id || 'N/A'}`);
//         // Send data to backend for verification
//         navigation.navigate('Dashboard');
//       })
//       .catch((error: any) => {
//         setIsLoading(false);
//         Alert.alert('Payment Failed', error.description || 'Payment failed. Please try again.');
//       });
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.header}>Make Payment</Text>
      
//       <View style={styles.formGroup}>
//         <Text style={styles.label}>Select Payment Type:</Text>
//         <Picker
//           selectedValue={selectedPaymentType}
//           onValueChange={handlePaymentTypeChange}
//           style={styles.picker}
//         >
//           {paymentTypes.map(type => (
//             <Picker.Item key={type.value} label={type.label} value={type.value} />
//           ))}
//         </Picker>
//       </View>

//       <View style={styles.formGroup}>
//         <Text style={styles.label}>Amount (INR):</Text>
//         {selectedPaymentType === 'custom' ? (
//           <TextInput
//             style={styles.input}
//             value={amount.toString()}
//             onChangeText={(text) => setAmount(parseInt(text) || 0)}
//             placeholder="Enter amount"
//             keyboardType="numeric"
//           />
//         ) : (
//           <Text style={styles.amountText}>₹{amount}</Text>
//         )}
//       </View>

//       <TouchableOpacity
//         style={[styles.button, isLoading && styles.buttonDisabled]}
//         onPress={initiatePayment}
//         disabled={isLoading}
//       >
//         <Text style={styles.buttonText}>{isLoading ? 'Processing...' : 'Pay Now'}</Text>
//       </TouchableOpacity>

//       <TouchableOpacity
//         style={styles.backButton}
//         onPress={() => navigation.navigate('Dashboard')}
//       >
//         <Text style={styles.backButtonText}>Back to Dashboard</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 16, backgroundColor: '#f5f5f5' },
//   header: { fontSize: 24, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
//   formGroup: { marginBottom: 16 },
//   label: { fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
//   picker: { backgroundColor: '#fff', borderRadius: 8, height: 50 },
//   input: { backgroundColor: '#fff', padding: 12, borderRadius: 8, fontSize: 16 },
//   amountText: { backgroundColor: '#fff', padding: 12, borderRadius: 8, fontSize: 16, textAlign: 'center' },
//   button: { backgroundColor: '#007AFF', padding: 12, borderRadius: 8, alignItems: 'center', marginTop: 16 },
//   buttonDisabled: { backgroundColor: '#ccc' },
//   buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
//   backButton: { backgroundColor: '#6c757d', padding: 12, borderRadius: 8, alignItems: 'center', marginTop: 8 },
//   backButtonText: { color: '#fff', fontSize: 16 },
// });

// export default Payment;