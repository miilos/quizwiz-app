import React, { useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useQuery, useMutation } from '@apollo/client/react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GET_QUIZ } from '../graphql/queries';
import { CREATE_ATTEMPT } from '../graphql/mutations';
import type { QuizDetails, QuizAttempt, AttemptRef, Tag as TagType } from '../types';
import Tag from '../components/Tag';
import Question from '../components/Question';
import Button from '../components/Button';
import ErrorModal from '../components/ErrorModal';
import { C } from '../theme';

type AttemptState = 'notStarted' | 'started' | 'finished';

export default function QuizDetailsScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { id } = route.params;

  const [attemptState, setAttemptState] = useState<AttemptState>('notStarted');
  const [showLoginError, setShowLoginError] = useState(false);
  const [attemptRef, setAttemptRef] = useState<AttemptRef>({ quizId: id, answers: [] });
  const [allAnswered, setAllAnswered] = useState(false);

  const { loading, error, data } = useQuery<{ quiz: QuizDetails }>(GET_QUIZ, {
    variables: { id },
  });

  const [createAttempt, { data: attemptData, loading: attemptLoading, error: attemptError }] =
    useMutation<{ createAttempt: QuizAttempt }>(CREATE_ATTEMPT);

  const quiz = data?.quiz;

  const handleStart = async () => {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      setShowLoginError(true);
      return;
    }
    setAttemptState('started');
    setAttemptRef({ quizId: id, answers: [] });
    setAllAnswered(false);
  };

  const updateAnswer = (questionId: number, answers: number[]) => {
    setAttemptRef((prev) => {
      const idx = prev.answers.findIndex((a) => a.questionId === questionId);
      const next = { ...prev };
      if (idx !== -1) {
        next.answers = prev.answers.map((a, i) => (i === idx ? { ...a, answers } : a));
      } else {
        next.answers = [...prev.answers, { questionId, answers }];
      }
      // check all answered
      if (quiz) {
        const filled = quiz.questions.every((q) => {
          const ans = next.answers.find((a) => a.questionId === q.id);
          return ans && ans.answers.length === q.correctAnswer.length;
        });
        setAllAnswered(filled);
      }
      return next;
    });
  };

  const handleFinish = async () => {
    const token = await AsyncStorage.getItem('token');
    await createAttempt({
      variables: { attempt: attemptRef },
      context: { headers: { Authorization: `Bearer ${token}` } },
    });
    setAttemptState('finished');
  };

  if (loading) {
    return <ActivityIndicator size="large" color={C.primary} style={{ marginTop: 80 }} />;
  }

  if (error || !quiz) {
    return <Text style={styles.error}>Quiz not found.</Text>;
  }

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

      {attemptState === 'notStarted' && (
        <Button onPress={handleStart} style={styles.startBtn}>
          Start quiz
        </Button>
      )}

      {attemptState === 'started' && (
        <>
          {quiz.questions.map((q) => (
            <Question
              key={q.id}
              question={q}
              onAnswerSelect={updateAnswer}
              onQuestionComplete={() => {}}
            />
          ))}
          {allAnswered && (
            <Button onPress={handleFinish} loading={attemptLoading} style={styles.finishBtn}>
              Finish quiz
            </Button>
          )}
        </>
      )}

      {attemptState === 'finished' && attemptData && (
        <>
          <View style={styles.resultsHeader}>
            <Text style={styles.resultsTitle}>Your result:</Text>
            <Text style={styles.percentage}>{attemptData.createAttempt.percentageScore}%</Text>
            <Text style={styles.score}>
              {attemptData.createAttempt.correctAnswerCount} / {attemptData.createAttempt.correctAnswerCount + attemptData.createAttempt.incorrectAnswerCount} correct
            </Text>
          </View>

          {quiz.questions.map((q) => {
            const ans = attemptData.createAttempt.answers.find(
              (a) => Number(a.questionId) === q.id
            );
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

          <Button onPress={() => navigation.goBack()} variant="secondary" style={styles.backBtn}>
            Back to quizzes
          </Button>
        </>
      )}

      {showLoginError && (
        <ErrorModal
          message="You need to log in first."
          onClose={() => setShowLoginError(false)}
        />
      )}
      {attemptError && (
        <ErrorModal message={attemptError.message} />
      )}
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
  startBtn: { marginBottom: 24 },
  finishBtn: { marginTop: 16, marginBottom: 24 },
  backBtn: { marginTop: 16 },
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
  error: { color: C.errorMedium, textAlign: 'center', marginTop: 80 },
});
