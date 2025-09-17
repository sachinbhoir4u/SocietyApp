import React from 'react';
import { TouchableOpacity, Text, StyleProp, ViewStyle, TextStyle } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { COLORS, SIZES } from '../utils/constants';

interface ButtonProps {
  title: string;
  onPress: () => void;
  icon?: string;
  style?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
}

export default function CustomButton({ title, onPress, icon, style, titleStyle }: ButtonProps) {
  return (
    <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
      {icon && <FontAwesome name={icon} size={20} color="white" style={styles.icon} />}
      <Text style={[styles.title, titleStyle]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = {
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: SIZES.padding,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    marginVertical: SIZES.margin,
  },
  title: {
    color: 'white',
    fontSize: SIZES.text,
    fontWeight: 'bold' as const,
  },
  icon: {
    marginRight: 10,
  },
};