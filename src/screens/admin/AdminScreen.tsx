import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { apiGetMe } from '../../api/rest';
import AdminUsersTab from './AdminUsersTab';
import AdminQuizzesTab from './AdminQuizzesTab';
import AdminAccessLogTab from './AdminAccessLogTab';
import { C } from '../../theme';

type Tab = 'users' | 'quizzes' | 'accesslog';

export default function AdminScreen() {
  const [activeTab, setActiveTab] = useState<Tab>('users');
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const check = async () => {
      try {
        const { res, json } = await apiGetMe();
        if (res.ok && json.data.user.roles.includes('ROLE_ADMIN')) {
          setAuthorized(true);
        }
      } catch {}
      setLoading(false);
    };
    check();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color={C.primary} style={{ marginTop: 80 }} />;
  }

  if (!authorized) {
    return (
      <View style={styles.unauthorized}>
        <Text style={styles.unauthorizedText}>Admin access required.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.tabs}>
        {(['users', 'quizzes', 'accesslog'] as Tab[]).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
              {tab === 'users' ? 'Users' : tab === 'quizzes' ? 'Quizzes' : 'Access Log'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {activeTab === 'users' && <AdminUsersTab />}
      {activeTab === 'quizzes' && <AdminQuizzesTab />}
      {activeTab === 'accesslog' && <AdminAccessLogTab />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.secondaryLight, paddingTop: 68 },
  tabs: {
    flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: C.secondaryMedium, backgroundColor: C.white,
  },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center' },
  tabActive: { borderBottomWidth: 2, borderBottomColor: C.primary },
  tabText: { fontSize: 14, color: C.textMuted, fontWeight: '500' },
  tabTextActive: { color: C.primary, fontWeight: '700' },
  unauthorized: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  unauthorizedText: { color: C.errorMedium, fontSize: 16 },
});
