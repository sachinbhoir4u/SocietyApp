import React from 'react';
import { TextInput, View, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { COLORS, SIZES } from '../utils/constants';

interface InputProps {
  placeholder: string;
  icon?: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
}

export default function CustomInput({
  placeholder,
  icon,
  value,
  onChangeText,
  secureTextEntry,
  keyboardType,
}: InputProps) {
  return (
    <View style={styles.container}>
      {icon && <FontAwesome name={icon} size={20} color={COLORS.primary} style={styles.icon} />}
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize="none"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.primary,
    marginVertical: SIZES.margin,
  },
  input: {
    flex: 1,
    fontSize: SIZES.text,
    paddingVertical: 10,
    color: COLORS.text,
  },
  icon: {
    marginRight: 10,
  },
});