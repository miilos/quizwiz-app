import React, { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useAppDispatch } from '../store/hooks';
import { setUser } from '../store/userSlice';
import { apiLogin } from '../api/rest';
import Button from '../components/Button';
import FormError from '../components/FormError';
import { C } from '../theme';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const { res, json } = await apiLogin(email, password);
      if (!res.ok) {
        setError(json.message ?? 'Login failed');
        return;
      }
      await AsyncStorage.setItem('token', json.data.token);
      dispatch(setUser(json.data.user));
    } catch {
      setError('Network error. Check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Log in</Text>

        {error ? <FormError>{error}</FormError> : null}

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor={C.textPlaceholder}
          placeholder="Enter email..."
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholderTextColor={C.textPlaceholder}
          placeholder="Enter password..."
          onSubmitEditing={handleLogin}
        />

        <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
          <Text style={styles.forgot}>Forgot password?</Text>
        </TouchableOpacity>

        <Button onPress={handleLogin} loading={loading} style={styles.btn}>
          Log in
        </Button>

        <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
          <Text style={styles.link}>Don't have an account? Sign up</Text>
        </TouchableOpacity>
      </ScrollView>
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
  forgot: { color: C.primaryMedium, fontSize: 13, marginBottom: 20 },
  btn: { marginBottom: 16 },
  link: { color: C.primaryMedium, textAlign: 'center', fontSize: 14 },
});
