import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery, useMutation } from '@apollo/client/react';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { GET_ALL_QUIZZES } from '../../graphql/queries';
import { DELETE_QUIZ } from '../../graphql/mutations';
import { BACKEND_BASE_URI } from '../../api/rest';
import type { QuizOverview } from '../../types';
import ErrorModal from '../../components/ErrorModal';
import { C } from '../../theme';

export default function AdminQuizzesTab() {
  const navigation = useNavigation<any>();
  const [deletedIds, setDeletedIds] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);

  const { loading, data } = useQuery<{ quizzes: QuizOverview[] }>(GET_ALL_QUIZZES);
  const quizzes = (data?.quizzes ?? []).filter((q) => !deletedIds.includes(q.id));

  const [deleteQuizMutation] = useMutation<{ deleteQuiz: boolean }>(DELETE_QUIZ);

  const handleDelete = async (id: number) => {
    const token = await AsyncStorage.getItem('token');
    const { data: d } = await deleteQuizMutation({
      variables: { id },
      context: { headers: { Authorization: `Bearer ${token}` } },
    });
    if (!d?.deleteQuiz) {
      setError('Error deleting quiz');
      return;
    }
    setDeletedIds((prev) => [...prev, id]);
  };

  const handlePrint = async (id: number) => {
    const token = await AsyncStorage.getItem('token');
    const uri = FileSystem.documentDirectory + `quiz-${id}.pdf`;
    try {
      const result = await FileSystem.downloadAsync(
        `${BACKEND_BASE_URI}/api/quiz/${id}/pdf`,
        uri,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await Sharing.shareAsync(result.uri, { mimeType: 'application/pdf' });
    } catch {
      setError('Error generating PDF');
    }
  };

  if (loading) return <ActivityIndicator size="large" color={C.primary} style={{ marginTop: 40 }} />;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Quizzes</Text>
      </View>
      <FlatList
        data={quizzes}
        keyExtractor={(q) => String(q.id)}
        contentContainerStyle={styles.list}
        renderItem={({ item: quiz }) => (
          <View style={styles.card}>
            <View style={styles.info}>
              <Text style={styles.quizTitle}>{quiz.title}</Text>
              {quiz.description ? (
                <Text style={styles.description} numberOfLines={1}>{quiz.description}</Text>
              ) : null}
              <Text style={styles.count}>{quiz.questions.length} questions</Text>
            </View>
            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.actionBtn}
                onPress={() => navigation.navigate('EditQuiz', { id: quiz.id })}
              >
                <Text style={styles.actionEdit}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionBtn} onPress={() => handleDelete(quiz.id)}>
                <Text style={styles.actionDelete}>Delete</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionBtn} onPress={() => handlePrint(quiz.id)}>
                <Text style={styles.actionPrint}>PDF</Text>
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
  header: { padding: 16 },
  title: { fontSize: 18, fontWeight: '700', color: C.primary },
  list: { paddingHorizontal: 16, paddingBottom: 40 },
  card: {
    backgroundColor: C.primary, borderRadius: 10, padding: 14, marginBottom: 10,
    flexDirection: 'row', alignItems: 'center',
    shadowColor: C.primary, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06,
    shadowRadius: 3, elevation: 2,
  },
  info: { flex: 1 },
  quizTitle: { fontSize: 15, fontWeight: '700', color: C.secondaryLight },
  description: { fontSize: 13, color: C.secondaryMedium, marginBottom: 2 },
  count: { fontSize: 12, color: C.secondaryMedium },
  actions: { flexDirection: 'row', gap: 8 },
  actionBtn: { padding: 6 },
  actionEdit: { color: C.secondary, fontSize: 13, fontWeight: '600' },
  actionDelete: { color: C.errorLight, fontSize: 13, fontWeight: '600' },
  actionPrint: { color: C.secondaryMedium, fontSize: 13, fontWeight: '600' },
});
