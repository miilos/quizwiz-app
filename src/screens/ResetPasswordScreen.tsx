import React, { useState } from 'react';
import {
  Text, TextInput, StyleSheet, ScrollView, KeyboardAvoidingView, Platform
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { apiResetPassword } from '../api/rest';
import Button from '../components/Button';
import InfoModal from '../components/InfoModal';
import { C } from '../theme';

export default function ResetPasswordScreen() {
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigation = useNavigation<any>();

  const handleReset = async () => {
    setLoading(true);
    try {
      const { res, json } = await apiResetPassword(token, newPassword);
      if (!res.ok) {
        setError(json.message ?? 'Reset failed');
        return;
      }
      navigation.navigate('Login');
    } catch {
      setError('Network error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Reset password</Text>

        <Text style={styles.label}>Reset token</Text>
        <TextInput
          style={styles.input}
          value={token}
          onChangeText={setToken}
          autoCapitalize="none"
          placeholder="Enter reset token..."
          placeholderTextColor={C.textPlaceholder}
        />

        <Text style={styles.label}>New password</Text>
        <TextInput
          style={styles.input}
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry
          placeholder="Enter new password..."
          placeholderTextColor={C.textPlaceholder}
          onSubmitEditing={handleReset}
        />

        <Button onPress={handleReset} loading={loading}>
          Reset password
        </Button>
      </ScrollView>
      {error && (
        <InfoModal title="Error" message={error} onClose={() => setError(null)} />
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
