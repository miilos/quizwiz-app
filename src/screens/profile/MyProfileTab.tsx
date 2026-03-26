import React, { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, ScrollView
} from 'react-native';
import { useAppDispatch } from '../../store/hooks';
import { setUser } from '../../store/userSlice';
import { apiEditProfile } from '../../api/rest';
import type { ProfileUser } from '../../types';
import Button from '../../components/Button';
import ErrorModal from '../../components/ErrorModal';
import InfoModal from '../../components/InfoModal';
import { C } from '../../theme';

interface MyProfileTabProps {
  userData: ProfileUser;
  onLogout: () => void;
  onProfileUpdate: (newUsername: string) => void;
}

export default function MyProfileTab({ userData, onLogout, onProfileUpdate }: MyProfileTabProps) {
  const [username, setUsername] = useState(userData.username);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const dispatch = useAppDispatch();
  const initials = userData.username.substring(0, 2).toUpperCase();

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const { res, json } = await apiEditProfile(username);
      if (!res.ok) {
        setError(json.message ?? 'Update failed');
        return;
      }
      dispatch(setUser(json.data.user));
      onProfileUpdate(username);
      setShowSuccess(true);
    } catch {
      setError('Network error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.avatarRow}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <Text style={styles.username}>{userData.username}</Text>
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
        value={userData.email}
        editable={false}
      />

      <Button onPress={handleUpdate} loading={loading} style={styles.btn}>
        Update profile
      </Button>

      <Button onPress={onLogout} variant="logout" style={styles.logoutBtn}>
        Log out
      </Button>

      {showSuccess && (
        <InfoModal
          title="Success"
          message="Profile successfully updated!"
          onClose={() => setShowSuccess(false)}
        />
      )}
      {error ? <ErrorModal message={error} onClose={() => setError('')} /> : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 24, paddingBottom: 40 },
  avatarRow: { alignItems: 'center', marginBottom: 24 },
  avatar: {
    width: 72, height: 72, borderRadius: 36, backgroundColor: C.primary,
    justifyContent: 'center', alignItems: 'center', marginBottom: 8,
  },
  avatarText: { color: C.secondaryLight, fontSize: 24, fontWeight: '800' },
  username: { fontSize: 18, fontWeight: '700', color: C.primary },
  label: { fontSize: 14, fontWeight: '600', color: C.textBody, marginBottom: 4 },
  input: {
    borderWidth: 1, borderColor: C.border, borderRadius: 8, padding: 12,
    fontSize: 15, backgroundColor: C.inputBg, color: C.textDark, marginBottom: 14,
  },
  readOnly: { backgroundColor: C.readOnlyBg, color: C.textMuted },
  btn: { marginBottom: 10 },
  logoutBtn: { borderWidth: 1, borderColor: C.errorLight },
});
