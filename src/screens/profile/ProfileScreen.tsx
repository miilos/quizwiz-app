import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppDispatch } from '../../store/hooks';
import { clearUser } from '../../store/userSlice';
import { apiGetMe } from '../../api/rest';
import type { ProfileUser } from '../../types';
import MyQuizzesTab from './MyQuizzesTab';
import MyLearningTab from './MyLearningTab';
import MyProfileTab from './MyProfileTab';
import { C } from '../../theme';

type Tab = 'quizzes' | 'learning' | 'profile';

export default function ProfileScreen() {
  const [activeTab, setActiveTab] = useState<Tab>('quizzes');
  const [userData, setUserData] = useState<ProfileUser | null>(null);
  const [loading, setLoading] = useState(true);

  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetch = async () => {
      try {
        const { res, json } = await apiGetMe();
        if (res.ok) setUserData(json.data.user);
      } catch {}
      setLoading(false);
    };
    fetch();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    dispatch(clearUser());
  };

  const handleProfileUpdate = (newUsername: string) => {
    setUserData((prev) => (prev ? { ...prev, username: newUsername } : prev));
  };

  if (loading) {
    return <ActivityIndicator size="large" color={C.primary} style={{ marginTop: 80 }} />;
  }

  if (!userData) return null;

  return (
    <View style={styles.container}>
      <View style={styles.tabs}>
        {(['quizzes', 'learning', 'profile'] as Tab[]).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
              {tab === 'quizzes' ? 'My quizzes' : tab === 'learning' ? 'My learning' : 'My profile'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {activeTab === 'quizzes' && (
        <MyQuizzesTab quizzes={userData.quizzes} />
      )}
      {activeTab === 'learning' && (
        <MyLearningTab attempts={userData.quizAttempts} />
      )}
      {activeTab === 'profile' && (
        <MyProfileTab
          userData={userData}
          onLogout={handleLogout}
          onProfileUpdate={handleProfileUpdate}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.secondaryLight, paddingTop: 68 },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: C.secondaryMedium,
    backgroundColor: C.white,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: C.primary,
  },
  tabText: { fontSize: 13, color: C.textMuted, fontWeight: '500' },
  tabTextActive: { color: C.primary, fontWeight: '700' },
});
