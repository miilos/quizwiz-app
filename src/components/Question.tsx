import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import type { Question as QuestionType } from '../types';
import { C } from '../theme';

interface QuestionProps {
  question: QuestionType;
  onAnswerSelect: (questionId: number, answer: number[]) => void;
  onQuestionComplete: (questionId: number) => void;
}

export default function Question({ question, onAnswerSelect, onQuestionComplete }: QuestionProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);

  const handleSelect = (idx: number) => {
    let next: number[];
    if (question.type === 'one') {
      next = selectedAnswers[0] === idx ? [] : [idx];
    } else {
      next = selectedAnswers.includes(idx)
        ? selectedAnswers.filter((a) => a !== idx)
        : [...selectedAnswers, idx];
    }
    setSelectedAnswers(next);
    onAnswerSelect(question.id, next);
    if (next.length === question.correctAnswer.length) {
      onQuestionComplete(question.id);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.number}>{question.position}.</Text>
        <Text style={styles.typeLabel}>
          {question.type === 'one' ? 'Single choice' : 'Multiple choice'}
        </Text>
      </View>
      <Text style={styles.text}>{question.text}</Text>
      <View style={styles.options}>
        {question.options.map((option, i) => {
          const selected = selectedAnswers.includes(i);
          return (
            <TouchableOpacity
              key={i}
              style={[styles.option, selected && styles.optionSelected]}
              onPress={() => handleSelect(i)}
              activeOpacity={0.8}
            >
              <Text style={[styles.optionText, selected && styles.optionTextSelected]}>
                {option}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: C.primary,
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    shadowColor: C.primary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  number: {
    fontSize: 16,
    fontWeight: '700',
    color: C.secondary,
  },
  typeLabel: {
    fontSize: 12,
    color: C.primary,
    backgroundColor: C.secondaryMedium,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
    color: C.secondaryLight,
    marginBottom: 12,
  },
  options: {
    gap: 8,
  },
  option: {
    borderWidth: 1,
    borderColor: 'rgba(247,242,234,0.25)',
    borderRadius: 8,
    padding: 12,
    backgroundColor: 'rgba(247,242,234,0.08)',
  },
  optionSelected: {
    borderColor: C.secondary,
    backgroundColor: 'rgba(245,198,112,0.2)',
  },
  optionText: {
    fontSize: 14,
    color: C.secondaryLight,
  },
  optionTextSelected: {
    color: C.secondary,
    fontWeight: '600',
  },
});
