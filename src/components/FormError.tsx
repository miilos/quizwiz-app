import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { C } from '../theme';

interface FormErrorProps {
  children: React.ReactNode;
}

export default function FormError({ children }: FormErrorProps) {
  return <Text style={styles.error}>{children}</Text>;
}

const styles = StyleSheet.create({
  error: {
    color: C.errorMedium,
    fontSize: 13,
    marginBottom: 4,
  },
});
