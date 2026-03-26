import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle } from 'react-native';
import { C } from '../theme';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger' | 'logout';
  onPress: () => void;
  children: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}

const variantColors: Record<string, { bg: string; text: string }> = {
  primary: { bg: C.primary, text: C.secondaryLight },
  secondary: { bg: C.secondaryLight, text: C.primary },
  danger: { bg: C.errorLight, text: C.errorDark },
  logout: { bg: C.errorLight, text: C.errorDark },
};

export default function Button({ variant = 'primary', onPress, children, loading, disabled, style }: ButtonProps) {
  const colors = variantColors[variant] ?? variantColors.primary;
  return (
    <TouchableOpacity
      style={[styles.btn, { backgroundColor: colors.bg }, disabled && styles.disabled, style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={colors.text} />
      ) : (
        <Text style={[styles.text, { color: colors.text }]}>{children}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  text: {
    fontSize: 15,
    fontWeight: '600',
  },
  disabled: {
    opacity: 0.6,
  },
});
