import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { apiGetAccountList, apiDeleteAccount } from '../../api/rest';
import type { AdminUser } from '../../types';
import Button from '../../components/Button';
import ErrorModal from '../../components/ErrorModal';
import { C } from '../../theme';

export default function AdminUsersTab() {
  const navigation = useNavigation<any>();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { res, json } = await apiGetAccountList();
        if (res.ok) setUsers(json.data.users);
      } catch {}
      setLoading(false);
    };
    fetch();
  }, []);

  const handleDelete = async (id: number) => {
    const { res } = await apiDeleteAccount(id);
    if (!res.ok) {
      setError('Error deleting account');
      return;
    }
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  if (loading) return <ActivityIndicator size="large" color={C.primary} style={{ marginTop: 40 }} />;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Users</Text>
        <Button
          onPress={() => navigation.navigate('AdminCreateUser')}
          variant="primary"
          style={styles.addBtn}
        >
          Add account
        </Button>
      </View>
      <FlatList
        data={users}
        keyExtractor={(u) => String(u.id)}
        contentContainerStyle={styles.list}
        renderItem={({ item: user }) => (
          <View style={styles.card}>
            <View style={styles.info}>
              <Text style={styles.username}>{user.username}</Text>
              <Text style={styles.email}>{user.email}</Text>
              <Text style={styles.stats}>
                {user.quizzes.length} quizzes · {user.quizAttempts.length} attempts
              </Text>
            </View>
            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.actionBtn}
                onPress={() => navigation.navigate('AdminEditUser', { user })}
              >
                <Text style={styles.actionEdit}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionBtn} onPress={() => handleDelete(user.id)}>
                <Text style={styles.actionDelete}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
      {error && <ErrorModal message={error} onClose={() => setError(null)} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 },
  title: { fontSize: 18, fontWeight: '700', color: C.primary },
  addBtn: { paddingVertical: 8, paddingHorizontal: 14 },
  list: { paddingHorizontal: 16, paddingBottom: 40 },
  card: {
    backgroundColor: C.primary, borderRadius: 10, padding: 14, marginBottom: 10,
    flexDirection: 'row', alignItems: 'center',
    shadowColor: C.primary, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06,
    shadowRadius: 3, elevation: 2,
  },
  info: { flex: 1 },
  username: { fontSize: 15, fontWeight: '700', color: C.secondaryLight },
  email: { fontSize: 13, color: C.secondaryMedium },
  stats: { fontSize: 12, color: C.secondaryMedium, marginTop: 2 },
  actions: { flexDirection: 'row', gap: 8 },
  actionBtn: { padding: 6 },
  actionEdit: { color: C.secondary, fontSize: 13, fontWeight: '600' },
  actionDelete: { color: C.errorLight, fontSize: 13, fontWeight: '600' },
});
