import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { QuizOverview } from '../types';
import Tag from './Tag';
import { C } from '../theme';

interface QuizCardProps {
  quiz: QuizOverview;
}

export default function QuizCard({ quiz }: QuizCardProps) {
  const navigation = useNavigation<any>();

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('QuizDetails', { id: quiz.id })}
      activeOpacity={0.85}
    >
      <View style={styles.mainInfo}>
        <Text style={styles.title}>{quiz.title}</Text>
        <Text style={styles.author}>by {quiz.author.username}</Text>
        {quiz.description ? (
          <Text style={styles.description} numberOfLines={2}>{quiz.description}</Text>
        ) : null}
      </View>
      <View style={styles.secondaryInfo}>
        <Text style={styles.questionCount}>{quiz.questions.length} questions</Text>
        {quiz.tags && quiz.tags.length > 0 && (
          <View style={styles.tags}>
            {quiz.tags.map((tag) => <Tag tag={tag} key={tag.id} />)}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: C.primary,
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    shadowColor: C.primary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  mainInfo: {
    marginBottom: 8,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: C.secondaryLight,
    marginBottom: 2,
  },
  author: {
    fontSize: 13,
    color: C.secondaryMedium,
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: C.secondaryMedium,
  },
  secondaryInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  questionCount: {
    fontSize: 13,
    color: C.secondaryMedium,
    marginRight: 8,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});
