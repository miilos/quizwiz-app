import React, { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, ScrollView, KeyboardAvoidingView, Platform
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { apiForgotPassword } from '../api/rest';
import Button from '../components/Button';
import InfoModal from '../components/InfoModal';
import { C } from '../theme';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState<{ title: string; message: string } | null>(null);

  const navigation = useNavigation<any>();

  const handleForgot = async () => {
    setLoading(true);
    try {
      const { res, json } = await apiForgotPassword(email);
      if (!res.ok) {
        setModal({ title: 'Error', message: json.message ?? 'Request failed' });
        return;
      }
      navigation.navigate('ResetPassword');
    } catch {
      setModal({ title: 'Error', message: 'Network error.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Forgot password</Text>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholder="Enter email..."
          placeholderTextColor={C.textPlaceholder}
          onSubmitEditing={handleForgot}
        />
        <Button onPress={handleForgot} loading={loading}>
          Send reset email
        </Button>
      </ScrollView>
      {modal && (
        <InfoModal title={modal.title} message={modal.message} onClose={() => setModal(null)} />
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.secondaryLight },
  content: { padding: 24, paddingTop: 76 },
  title: { fontSize: 28, fontWeight: '800', color: C.primary, marginBottom: 24 },
  label: { fontSize: 14, fontWeight: '600', color: C.textBody, marginBottom: 4 },
  input: {
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    backgroundColor: C.inputBg,
    color: C.textDark,
    marginBottom: 14,
  },
});
