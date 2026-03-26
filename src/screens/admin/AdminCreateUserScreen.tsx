import React, { useState } from 'react';
import {
  Text, TextInput, ScrollView, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { apiSignup } from '../../api/rest';
import Button from '../../components/Button';
import FormError from '../../components/FormError';
import InfoModal from '../../components/InfoModal';
import { C } from '../../theme';

interface FieldErrors {
  username?: string;
  email?: string;
  password?: string;
}

export default function AdminCreateUserScreen() {
  const navigation = useNavigation<any>();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [modal, setModal] = useState<{ title: string; message: string } | null>(null);

  const handleCreate = async () => {
    const errors: FieldErrors = {};
    if (!username) errors.username = 'Username must be filled out.';
    if (!email) errors.email = 'Email must be filled out.';
    if (!password) errors.password = 'Password must be filled out.';
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});
    setLoading(true);
    try {
      const { res, json } = await apiSignup(username, email, password);
      if (!res.ok) {
        if (json.violations) {
          const be: FieldErrors = {};
          for (const v of json.violations) {
            be[v.property as keyof FieldErrors] = v.message;
          }
          setFieldErrors(be);
        } else {
          setModal({ title: 'Error', message: json.message ?? 'Creation failed' });
        }
        return;
      }
      setUsername('');
      setEmail('');
      setPassword('');
      setModal({ title: 'Success', message: 'Account created successfully!' });
    } catch {
      setModal({ title: 'Error', message: 'Network error.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Create account</Text>

        {fieldErrors.username ? <FormError>{fieldErrors.username}</FormError> : null}
        <Text style={styles.label}>Username</Text>
        <TextInput
          style={styles.input}
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          placeholder="Enter username..."
          placeholderTextColor={C.textPlaceholder}
        />

        {fieldErrors.email ? <FormError>{fieldErrors.email}</FormError> : null}
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholder="Enter email..."
          placeholderTextColor={C.textPlaceholder}
        />

        {fieldErrors.password ? <FormError>{fieldErrors.password}</FormError> : null}
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="Enter password..."
          placeholderTextColor={C.textPlaceholder}
          onSubmitEditing={handleCreate}
        />

        <Button onPress={handleCreate} loading={loading}>
          Create account
        </Button>
      </ScrollView>

      {modal && (
        <InfoModal
          title={modal.title}
          message={modal.message}
          onClose={() => setModal(null)}
        />
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.secondaryLight },
  content: { padding: 24, paddingTop: 68, paddingBottom: 40 },
  back: { marginBottom: 16 },
  backText: { color: C.primaryMedium, fontSize: 15 },
  title: { fontSize: 28, fontWeight: '800', color: C.primary, marginBottom: 24 },
  label: { fontSize: 14, fontWeight: '600', color: C.textBody, marginBottom: 4 },
  input: {
    borderWidth: 1, borderColor: C.border, borderRadius: 8, padding: 12,
    fontSize: 15, backgroundColor: C.inputBg, color: C.textDark, marginBottom: 14,
  },
});
