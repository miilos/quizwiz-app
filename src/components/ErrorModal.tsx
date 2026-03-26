import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { C } from '../theme';

interface ErrorModalProps {
  message: string;
  onClose?: () => void;
}

export default function ErrorModal({ message, onClose }: ErrorModalProps) {
  return (
    <Modal transparent animationType="fade" visible>
      <View style={styles.overlay}>
        <View style={styles.box}>
          <Text style={styles.title}>Error</Text>
          <Text style={styles.message}>{message}</Text>
          {onClose && (
            <TouchableOpacity style={styles.btn} onPress={onClose}>
              <Text style={styles.btnText}>Close</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  box: {
    backgroundColor: C.white,
    borderRadius: 12,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    borderTopWidth: 4,
    borderTopColor: C.errorLight,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: C.errorMedium,
    marginBottom: 8,
  },
  message: {
    fontSize: 15,
    color: C.textDark,
    marginBottom: 16,
  },
  btn: {
    backgroundColor: C.errorLight,
    borderRadius: 32,
    paddingVertical: 10,
    alignItems: 'center',
  },
  btnText: {
    color: C.errorDark,
    fontWeight: '600',
  },
});
