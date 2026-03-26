import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { ProfileQuizAttempt } from '../../types';
import { C } from '../../theme';

interface MyLearningTabProps {
  attempts: ProfileQuizAttempt[];
}

export default function MyLearningTab({ attempts }: MyLearningTabProps) {
  const navigation = useNavigation<any>();

  if (attempts.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>You haven't attempted any quizzes yet.</Text>
      </View>
    );
  }

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return `${d.getDate()}.${d.getMonth() + 1}.${d.getFullYear()}.`;
  };

  return (
    <FlatList
      data={attempts}
      keyExtractor={(a) => String(a.id)}
      contentContainerStyle={styles.list}
      renderItem={({ item: attempt }) => (
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('Quizzes', { screen: 'AttemptReview', params: { id: attempt.id } })}
          activeOpacity={0.85}
        >
          <View style={styles.score}>
            <Text style={styles.scoreText}>{attempt.percentageScore}%</Text>
          </View>
          <View style={styles.info}>
            <Text style={styles.quizTitle}>{attempt.quiz.title}</Text>
            <Text style={styles.date}>{formatDate(attempt.attemptedAt)}</Text>
            <Text style={styles.counts}>
              <Text style={styles.correct}>✓ {attempt.correctAnswerCount} correct</Text>
              {'  '}
              <Text style={styles.incorrect}>✗ {attempt.incorrectAnswerCount} incorrect</Text>
            </Text>
          </View>
        </TouchableOpacity>
      )}
    />
  );
}

const styles = StyleSheet.create({
  list: { padding: 16, paddingBottom: 40 },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  emptyText: { color: C.textMuted, fontSize: 15 },
  card: {
    backgroundColor: C.primary, borderRadius: 10, padding: 14, marginBottom: 10,
    flexDirection: 'row', alignItems: 'center', gap: 14,
    shadowColor: C.primary, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06,
    shadowRadius: 3, elevation: 2,
  },
  score: {
    width: 60, height: 60, borderRadius: 30, backgroundColor: C.secondaryLight,
    justifyContent: 'center', alignItems: 'center',
  },
  scoreText: { color: C.primary, fontSize: 16, fontWeight: '800' },
  info: { flex: 1 },
  quizTitle: { fontSize: 15, fontWeight: '700', color: C.secondaryLight, marginBottom: 2 },
  date: { fontSize: 12, color: C.secondaryMedium, marginBottom: 4 },
  counts: { fontSize: 13 },
  correct: { color: C.successLight },
  incorrect: { color: C.errorLight },
});
