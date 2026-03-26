import React, { useState } from 'react';
import {
  View, Text, TextInput, ScrollView, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { apiAdminEditUser } from '../../api/rest';
import type { AdminUser } from '../../types';
import Button from '../../components/Button';
import InfoModal from '../../components/InfoModal';
import ErrorModal from '../../components/ErrorModal';
import { C } from '../../theme';

export default function AdminEditUserScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const user: AdminUser = route.params.user;

  const [username, setUsername] = useState(user.username);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const initials = username.substring(0, 2).toUpperCase();

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const { res, json } = await apiAdminEditUser(user.id, username);
      if (!res.ok) {
        setError(json.message ?? 'Update failed');
        return;
      }
      setShowSuccess(true);
    } catch {
      setError('Network error.');
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

        <View style={styles.avatarRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <Text style={styles.usernameLabel}>{username}</Text>
        </View>

        <Text style={styles.label}>Username</Text>
        <TextInput
          style={styles.input}
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          placeholder="Username"
          placeholderTextColor={C.textPlaceholder}
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={[styles.input, styles.readOnly]}
          value={user.email}
          editable={false}
        />

        <Button onPress={handleUpdate} loading={loading}>
          Edit account
        </Button>
      </ScrollView>

      {showSuccess && (
        <InfoModal
          title="Success"
          message="Account updated successfully!"
          onClose={() => { setShowSuccess(false); navigation.goBack(); }}
        />
      )}
      {error ? <ErrorModal message={error} onClose={() => setError('')} /> : null}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.secondaryLight },
  content: { padding: 24, paddingTop: 68, paddingBottom: 40 },
  back: { marginBottom: 16 },
  backText: { color: C.primaryMedium, fontSize: 15 },
  avatarRow: { alignItems: 'center', marginBottom: 24 },
  avatar: {
    width: 72, height: 72, borderRadius: 36, backgroundColor: C.primary,
    justifyContent: 'center', alignItems: 'center', marginBottom: 8,
  },
  avatarText: { color: C.secondaryLight, fontSize: 24, fontWeight: '800' },
  usernameLabel: { fontSize: 18, fontWeight: '700', color: C.primary },
  label: { fontSize: 14, fontWeight: '600', color: C.textBody, marginBottom: 4 },
  input: {
    borderWidth: 1, borderColor: C.border, borderRadius: 8, padding: 12,
    fontSize: 15, backgroundColor: C.inputBg, color: C.textDark, marginBottom: 14,
  },
  readOnly: { backgroundColor: C.readOnlyBg, color: C.textMuted },
});
