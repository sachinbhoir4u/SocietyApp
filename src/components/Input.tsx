// import React from 'react';
// import { TextInput, View, StyleSheet } from 'react-native';
// import { FontAwesome } from '@expo/vector-icons';
// import { COLORS, SIZES } from '../utils/constants';

// interface InputProps {
//   placeholder: string;
//   icon?: string;
//   value: string;
//   onChangeText: (text: string) => void;
//   secureTextEntry?: boolean;
//   keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
// }

// export default function CustomInput({
//   placeholder,
//   icon,
//   value,
//   onChangeText,
//   secureTextEntry,
//   keyboardType,
// }: InputProps) {
//   return (
//     <View style={styles.container}>
//       {icon && <FontAwesome name={icon} size={20} color={COLORS.primary} style={styles.icon} />}
//       <TextInput
//         style={styles.input}
//         placeholder={placeholder}
//         value={value}
//         onChangeText={onChangeText}
//         secureTextEntry={secureTextEntry}
//         keyboardType={keyboardType}
//         autoCapitalize="none"
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     borderBottomWidth: 1,
//     borderBottomColor: COLORS.primary,
//     marginVertical: SIZES.margin,
//   },
//   input: {
//     flex: 1,
//     fontSize: SIZES.text,
//     paddingVertical: 10,
//     color: COLORS.text,
//   },
//   icon: {
//     marginRight: 10,
//   },
// });

// components/Input.tsx
import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

interface CustomInputProps {
  placeholder: string;
  icon: string;
  value: string;
  onChangeText: (text: string) => void;
  keyboardType?: string;
  secureTextEntry?: boolean;
  maxLength?: number;
  rightIcon?: string;
  onRightIconPress?: () => void;
}

const CustomInput: React.FC<CustomInputProps> = ({
  placeholder,
  icon,
  value,
  onChangeText,
  keyboardType,
  secureTextEntry,
  maxLength,
  rightIcon,
  onRightIconPress,
}) => {
  return (
    <View style={styles.container}>
      <FontAwesome name={icon} size={20} color="#666" style={styles.icon} />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        maxLength={maxLength}
      />
      {rightIcon && (
        <TouchableOpacity onPress={onRightIconPress} style={styles.rightIcon}>
          <FontAwesome name={rightIcon} size={20} color="#666" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 2,
    marginBottom: 10,
    borderWidth: 1, 
    borderColor: '#d6d6d6ff', 
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 16,
  },
  icon: {
    marginRight: 10,
  },
  rightIcon: {
    marginLeft: 10,
  },
});

export default CustomInput;