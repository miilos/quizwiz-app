import React from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView
} from 'react-native';
import type { QuestionDraft } from '../types';
import { C } from '../theme';

interface CreateQuizQuestionProps {
  question: QuestionDraft;
  questionNumber: number;
  onUpdate: (updates: Partial<QuestionDraft>) => void;
  onRemove: () => void;
}

export default function CreateQuizQuestion({
  question, questionNumber, onUpdate, onRemove
}: CreateQuizQuestionProps) {

  const handleOptionChange = (idx: number, value: string) => {
    const newOptions = [...question.options];
    newOptions[idx] = value;
    onUpdate({ options: newOptions });
  };

  const handleRemoveOption = (idx: number) => {
    const newOptions = question.options.filter((_, i) => i !== idx);
    const newCorrectAnswers = question.correctAnswers
      .filter((a) => a !== idx)
      .map((a) => (a > idx ? a - 1 : a));
    onUpdate({ options: newOptions, correctAnswers: newCorrectAnswers });
  };

  const handleCorrectAnswerToggle = (idx: number) => {
    if (question.type === 'one') {
      onUpdate({ correctAnswers: question.correctAnswers[0] === idx ? [] : [idx] });
    } else {
      const isSelected = question.correctAnswers.includes(idx);
      onUpdate({
        correctAnswers: isSelected
          ? question.correctAnswers.filter((a) => a !== idx)
          : [...question.correctAnswers, idx],
      });
    }
  };

  const handleTypeChange = (type: 'one' | 'multiple') => {
    const updates: Partial<QuestionDraft> = { type };
    if (type === 'one' && question.correctAnswers.length > 1) {
      updates.correctAnswers = [question.correctAnswers[0]];
    }
    onUpdate(updates);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.number}>{questionNumber}.</Text>
        <TouchableOpacity onPress={onRemove} style={styles.removeBtn}>
          <Text style={styles.removeBtnText}>Remove</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Enter question..."
        placeholderTextColor={C.textPlaceholder}
        value={question.text}
        onChangeText={(t) => onUpdate({ text: t })}
        multiline
      />

      <Text style={styles.label}>Options</Text>
      {question.options.map((option, idx) => (
        <View key={idx} style={styles.optionRow}>
          <TouchableOpacity
            style={[styles.checkbox, question.correctAnswers.includes(idx) && styles.checkboxChecked]}
            onPress={() => handleCorrectAnswerToggle(idx)}
          >
            {question.correctAnswers.includes(idx) && <Text style={styles.checkmark}>✓</Text>}
          </TouchableOpacity>
          <TextInput
            style={styles.optionInput}
            placeholder={`Answer option ${idx + 1}...`}
            placeholderTextColor={C.textPlaceholder}
            value={option}
            onChangeText={(v) => handleOptionChange(idx, v)}
          />
          <TouchableOpacity onPress={() => handleRemoveOption(idx)} style={styles.removeOption}>
            <Text style={styles.removeOptionText}>✕</Text>
          </TouchableOpacity>
        </View>
      ))}

      <TouchableOpacity
        style={styles.addOptionBtn}
        onPress={() => onUpdate({ options: [...question.options, ''] })}
      >
        <Text style={styles.addOptionText}>+ Add option</Text>
      </TouchableOpacity>

      <Text style={styles.label}>Type</Text>
      <View style={styles.typeRow}>
        <TouchableOpacity
          style={[styles.typeBtn, question.type === 'one' && styles.typeBtnActive]}
          onPress={() => handleTypeChange('one')}
        >
          <Text style={[styles.typeBtnText, question.type === 'one' && styles.typeBtnTextActive]}>
            Single
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.typeBtn, question.type === 'multiple' && styles.typeBtnActive]}
          onPress={() => handleTypeChange('multiple')}
        >
          <Text style={[styles.typeBtnText, question.type === 'multiple' && styles.typeBtnTextActive]}>
            Multiple
          </Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={[styles.input, { marginTop: 8 }]}
        placeholder="Explanation (optional)..."
        placeholderTextColor={C.textPlaceholder}
        value={question.explanation}
        onChangeText={(t) => onUpdate({ explanation: t })}
        multiline
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: C.primary,
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    shadowColor: C.primary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  number: {
    fontSize: 16,
    fontWeight: '700',
    color: C.secondary,
  },
  removeBtn: {
    padding: 4,
  },
  removeBtnText: {
    color: C.errorLight,
    fontSize: 13,
  },
  input: {
    borderWidth: 1,
    borderColor: 'rgba(247,242,234,0.25)',
    borderRadius: 6,
    padding: 10,
    fontSize: 14,
    color: C.secondaryLight,
    backgroundColor: 'rgba(247,242,234,0.08)',
    marginBottom: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: C.secondaryMedium,
    marginBottom: 6,
    marginTop: 4,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 8,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 2,
    borderColor: C.border,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    borderColor: C.successMedium,
    backgroundColor: C.successMedium,
  },
  checkmark: {
    color: C.white,
    fontSize: 13,
    fontWeight: '700',
  },
  optionInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'rgba(247,242,234,0.25)',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 14,
    color: C.secondaryLight,
    backgroundColor: 'rgba(247,242,234,0.08)',
  },
  removeOption: {
    padding: 4,
  },
  removeOptionText: {
    color: C.errorMedium,
    fontSize: 14,
  },
  addOptionBtn: {
    paddingVertical: 8,
    marginBottom: 8,
  },
  addOptionText: {
    color: C.secondary,
    fontSize: 14,
    fontWeight: '600',
  },
  typeRow: {
    flexDirection: 'row',
    gap: 8,
  },
  typeBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'rgba(247,242,234,0.25)',
    borderRadius: 6,
    paddingVertical: 8,
    alignItems: 'center',
  },
  typeBtnActive: {
    borderColor: C.secondary,
    backgroundColor: 'rgba(245,198,112,0.2)',
  },
  typeBtnText: {
    color: C.secondaryMedium,
    fontSize: 13,
  },
  typeBtnTextActive: {
    color: C.secondary,
    fontWeight: '600',
  },
});
