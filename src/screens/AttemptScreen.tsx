import React from 'react';
import { View, Text, ScrollView, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useQuery } from '@apollo/client/react';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { GET_ATTEMPT } from '../graphql/queries';
import type { QuizAttempt, QuizDetails, Tag as TagType } from '../types';
import Tag from '../components/Tag';
import Button from '../components/Button';
import { BACKEND_BASE_URI, getToken } from '../api/rest';
import { C } from '../theme';

interface GetAttemptResponse {
  attempt: Omit<QuizAttempt, 'quiz'> & { quiz: QuizDetails };
}

export default function AttemptScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { id } = route.params;

  const { loading, data } = useQuery<GetAttemptResponse>(GET_ATTEMPT, {
    variables: { id },
  });

  const handleSharePdf = async () => {
    const token = await getToken();
    const uri = FileSystem.documentDirectory + `quiz-attempt-${id}.pdf`;
    try {
      const result = await FileSystem.downloadAsync(
        `${BACKEND_BASE_URI}/api/quiz/${data?.attempt.quiz.id}/pdf`,
        uri,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await Sharing.shareAsync(result.uri, { mimeType: 'application/pdf' });
    } catch {
      // ignore share errors
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color={C.primary} style={{ marginTop: 80 }} />;
  }

  if (!data) return null;

  const { attempt } = data;
  const { quiz } = attempt;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      <View style={styles.header}>
        <Text style={styles.title}>{quiz.title}</Text>
        <Text style={styles.author}>by {quiz.author.username}</Text>
        {quiz.description ? <Text style={styles.description}>{quiz.description}</Text> : null}
      </View>

      <View style={styles.meta}>
        <Text style={styles.metaText}>{quiz.questions.length} questions</Text>
        {quiz.tags && quiz.tags.length > 0 && (
          <View style={styles.tags}>
            {quiz.tags.map((tag: TagType) => <Tag tag={tag} key={tag.id} />)}
          </View>
        )}
      </View>

      <View style={styles.resultsHeader}>
        <Text style={styles.resultsTitle}>Your result:</Text>
        <Text style={styles.percentage}>{attempt.percentageScore}%</Text>
        <Text style={styles.score}>
          {attempt.correctAnswerCount} / {attempt.correctAnswerCount + attempt.incorrectAnswerCount} correct
        </Text>
      </View>

      {quiz.questions.map((q) => {
        const ans = attempt.answers.find((a) => Number(a.questionId) === q.id);
        const isCorrect = ans?.status === 'correct';
        const userAnswers = (ans?.answers ?? []).map(Number);

        return (
          <View
            key={q.id}
            style={[styles.reviewCard, isCorrect ? styles.reviewCorrect : styles.reviewIncorrect]}
          >
            <Text style={styles.reviewPosition}>{q.position}.</Text>
            <Text style={styles.reviewText}>{q.text}</Text>
            {q.options.map((opt, i) => {
              const isAnswer = (q.correctAnswer as number[]).includes(i);
              const isSelected = userAnswers.includes(i);
              const highlighted = (isCorrect && (isAnswer || (isSelected && !isAnswer))) || (!isCorrect && isSelected);
              return (
                <View
                  key={i}
                  style={[
                    styles.reviewOption,
                    isCorrect && isAnswer && styles.reviewOptionAnswer,
                    isCorrect && isSelected && !isAnswer && styles.reviewOptionWrong,
                    !isCorrect && isSelected && styles.reviewOptionSelected,
                  ]}
                >
                  <Text style={[styles.reviewOptionText, highlighted && styles.reviewOptionTextHighlighted]}>
                    {isAnswer ? '✓ ' : ''}{opt}
                  </Text>
                </View>
              );
            })}
            {q.explanation ? (
              <Text style={styles.explanation}>{q.explanation}</Text>
            ) : null}
          </View>
        );
      })}

      {quiz.furtherReading ? (
        <View style={styles.furtherReading}>
          <Text style={styles.furtherReadingTitle}>Further reading</Text>
          <Text style={styles.furtherReadingText}>{quiz.furtherReading}</Text>
        </View>
      ) : null}

      <Button onPress={handleSharePdf} variant="secondary" style={styles.pdfBtn}>
        Share PDF
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.secondaryLight },
  content: { padding: 16, paddingTop: 68, paddingBottom: 40 },
  back: { marginBottom: 16 },
  backText: { color: C.primaryMedium, fontSize: 15 },
  header: { marginBottom: 12 },
  title: { fontSize: 22, fontWeight: '800', color: C.primary, marginBottom: 4 },
  author: { fontSize: 14, color: C.textMuted, marginBottom: 6 },
  description: { fontSize: 15, color: C.textBody },
  meta: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', marginBottom: 20 },
  metaText: { fontSize: 13, color: C.textMuted, marginRight: 8 },
  tags: { flexDirection: 'row', flexWrap: 'wrap' },
  resultsHeader: { alignItems: 'center', marginBottom: 24 },
  resultsTitle: { fontSize: 18, fontWeight: '700', color: C.primary },
  percentage: { fontSize: 48, fontWeight: '800', color: C.primary },
  score: { fontSize: 16, color: C.textBody },
  reviewCard: { borderRadius: 10, padding: 14, marginBottom: 10 },
  reviewCorrect: { backgroundColor: 'rgba(164,213,129,0.25)' },
  reviewIncorrect: { backgroundColor: 'rgba(232,138,143,0.25)' },
  reviewPosition: { fontSize: 13, fontWeight: '700', color: C.textBody, marginBottom: 4 },
  reviewText: { fontSize: 15, fontWeight: '600', color: C.textDark, marginBottom: 8 },
  reviewOption: { padding: 8, borderRadius: 6, marginBottom: 4, backgroundColor: 'rgba(255,255,255,0.6)' },
  reviewOptionAnswer: { backgroundColor: C.successMedium },
  reviewOptionWrong: { backgroundColor: C.errorMedium },
  reviewOptionSelected: { backgroundColor: C.errorMedium },
  reviewOptionText: { fontSize: 14, color: C.textDark },
  reviewOptionTextHighlighted: { color: C.secondaryLight, fontWeight: '600' },
  explanation: { fontSize: 13, color: C.textBody, marginTop: 8, fontStyle: 'italic' },
  furtherReading: { backgroundColor: C.white, borderRadius: 10, padding: 16, marginTop: 16 },
  furtherReadingTitle: { fontSize: 17, fontWeight: '700', marginBottom: 8, color: C.primary },
  furtherReadingText: { fontSize: 14, color: C.textBody, lineHeight: 22 },
  pdfBtn: { marginTop: 20 },
});
