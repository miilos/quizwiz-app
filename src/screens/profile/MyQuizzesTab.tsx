import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useMutation } from '@apollo/client/react';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { DELETE_QUIZ } from '../../graphql/mutations';
import { BACKEND_BASE_URI } from '../../api/rest';
import type { ProfileQuiz } from '../../types';
import ErrorModal from '../../components/ErrorModal';
import { C } from '../../theme';

interface MyQuizzesTabProps {
  quizzes: ProfileQuiz[];
}

export default function MyQuizzesTab({ quizzes: initialQuizzes }: MyQuizzesTabProps) {
  const navigation = useNavigation<any>();
  const [quizzes, setQuizzes] = useState(initialQuizzes);
  const [error, setError] = useState<string | null>(null);

  const [deleteQuizMutation] = useMutation<{ deleteQuiz: boolean }>(DELETE_QUIZ);

  const handleEdit = (id: number) => {
    navigation.navigate('EditQuiz', { id });
  };

  const handleDelete = async (id: number) => {
    const token = await AsyncStorage.getItem('token');
    const { data } = await deleteQuizMutation({
      variables: { id },
      context: { headers: { Authorization: `Bearer ${token}` } },
    });
    if (!data?.deleteQuiz) {
      setError('Error deleting quiz');
      return;
    }
    setQuizzes((prev) => prev.filter((q) => q.id !== id));
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

  if (quizzes.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>You haven't created any quizzes yet.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={quizzes}
        keyExtractor={(q) => String(q.id)}
        contentContainerStyle={styles.list}
        renderItem={({ item: quiz }) => (
          <View style={styles.card}>
            <View style={styles.info}>
              <Text style={styles.title}>{quiz.title}</Text>
              {quiz.description ? (
                <Text style={styles.description} numberOfLines={1}>{quiz.description}</Text>
              ) : null}
              <Text style={styles.count}>{quiz.questions.length} questions</Text>
            </View>
            <View style={styles.actions}>
              <TouchableOpacity style={styles.actionBtn} onPress={() => handleEdit(quiz.id)}>
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
  list: { padding: 16, paddingBottom: 40 },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  emptyText: { color: C.textMuted, fontSize: 15 },
  card: {
    backgroundColor: C.primary, borderRadius: 10, padding: 14, marginBottom: 10,
    flexDirection: 'row', alignItems: 'center',
    shadowColor: C.primary, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06,
    shadowRadius: 3, elevation: 2,
  },
  info: { flex: 1 },
  title: { fontSize: 16, fontWeight: '700', color: C.secondaryLight, marginBottom: 2 },
  description: { fontSize: 13, color: C.secondaryMedium, marginBottom: 2 },
  count: { fontSize: 12, color: C.secondaryMedium },
  actions: { flexDirection: 'row', gap: 8 },
  actionBtn: { padding: 6 },
  actionEdit: { color: C.secondary, fontSize: 13, fontWeight: '600' },
  actionDelete: { color: C.errorLight, fontSize: 13, fontWeight: '600' },
  actionPrint: { color: C.secondaryMedium, fontSize: 13, fontWeight: '600' },
});
