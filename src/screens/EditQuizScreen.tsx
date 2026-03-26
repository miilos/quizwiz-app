import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, TextInput, ScrollView, StyleSheet, TouchableOpacity,
  Modal, ActivityIndicator, KeyboardAvoidingView, Platform
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useMutation, useQuery } from '@apollo/client/react';
import { GET_QUIZ_FOR_EDIT } from '../graphql/queries';
import { UPDATE_QUIZ } from '../graphql/mutations';
import { apiGenerateQuestion } from '../api/rest';
import type { QuestionDraft, TagDraft } from '../types';
import CreateQuizQuestion from '../components/CreateQuizQuestion';
import Button from '../components/Button';
import ErrorModal from '../components/ErrorModal';
import FormError from '../components/FormError';
import { C } from '../theme';

export default function EditQuizScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const quizId: number = route.params.id;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [furtherReading, setFurtherReading] = useState('');
  const [tags, setTags] = useState<TagDraft[]>([]);
  const [questions, setQuestions] = useState<QuestionDraft[]>([]);
  const [initialized, setInitialized] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [newTagText, setNewTagText] = useState('');

  const [generateModalVisible, setGenerateModalVisible] = useState(false);
  const [generatePrompt, setGeneratePrompt] = useState('');
  const [generateLoading, setGenerateLoading] = useState(false);
  const [generateError, setGenerateError] = useState('');

  const newQuestionCounter = useRef(0);
  const nextNewId = () => --newQuestionCounter.current;
  const tagIdCounter = useRef(0);
  const nextTagId = () => ++tagIdCounter.current;

  const { loading: queryLoading, error: queryError, data } = useQuery<{ quiz: any }>(GET_QUIZ_FOR_EDIT, {
    variables: { id: quizId },
  });

  useEffect(() => {
    if (data?.quiz && !initialized) {
      const quiz = data.quiz;
      setTitle(quiz.title);
      setDescription(quiz.description ?? '');
      setFurtherReading(quiz.furtherReading ?? '');
      setTags(
        (quiz.tags ?? []).map((t: any) => ({ id: nextTagId(), name: t.name, editing: false }))
      );
      setQuestions(
        quiz.questions.map((q: any) => ({
          id: q.id,
          text: q.text,
          options: q.options,
          correctAnswers: Array.isArray(q.correctAnswer) ? q.correctAnswer : [q.correctAnswer],
          type: q.type as 'one' | 'multiple',
          explanation: q.explanation ?? '',
        }))
      );
      setInitialized(true);
    }
  }, [data, initialized]);

  const [updateQuizMutation, { loading }] = useMutation<{ updateQuiz: boolean }>(UPDATE_QUIZ);

  const handleAddQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      { id: nextNewId(), text: '', options: ['', '', '', ''], correctAnswers: [], type: 'one', explanation: '' },
    ]);
  };

  const handleGenerateQuestion = async () => {
    setGenerateLoading(true);
    setGenerateError('');
    try {
      const { res, json } = await apiGenerateQuestion(generatePrompt);
      if (!res.ok) {
        setGenerateError(json.message ?? 'Generation failed');
        return;
      }
      const { question } = json.data;
      setQuestions((prev) => [
        ...prev,
        {
          id: nextNewId(),
          text: question.question,
          options: question.answers,
          correctAnswers: [question.correctAnswer],
          type: 'one',
          explanation: question.explanation ?? '',
        },
      ]);
      setGenerateModalVisible(false);
      setGeneratePrompt('');
    } catch {
      setGenerateError('Network error.');
    } finally {
      setGenerateLoading(false);
    }
  };

  const handleAddTag = () => {
    const name = newTagText.trim();
    if (!name) return;
    setTags((prev) => [...prev, { id: nextTagId(), name, editing: false }]);
    setNewTagText('');
  };

  const handleRemoveTag = (id: number) => setTags((prev) => prev.filter((t) => t.id !== id));

  const handleUpdate = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      await updateQuizMutation({
        refetchQueries: ['GetQuiz', 'GetQuizForEdit'],
        variables: {
          id: quizId,
          quiz: {
            title,
            description,
            furtherReading,
            tags: tags.map(({ name }) => ({ name })),
            questions: questions.map((q) => ({
              id: q.id,
              text: q.text,
              options: q.options,
              correctAnswer: q.type === 'one' ? (q.correctAnswers[0] ?? 0) : q.correctAnswers,
              type: q.type,
              ...(q.explanation ? { explanation: q.explanation } : {}),
            })),
          },
        },
        context: { headers: { Authorization: `Bearer ${token}` } },
      });
      navigation.goBack();
    } catch (err: any) {
      setErrorMessage(err.message ?? 'An error occurred.');
    }
  };

  if (queryLoading) {
    return <ActivityIndicator size="large" color={C.primary} style={{ marginTop: 80 }} />;
  }
  if (queryError) {
    return <ErrorModal message={queryError.message} />;
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.screenTitle}>Edit quiz</Text>

        <TextInput
          style={styles.titleInput}
          placeholder="Enter title..."
          placeholderTextColor={C.textPlaceholder}
          value={title}
          onChangeText={setTitle}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter description..."
          placeholderTextColor={C.textPlaceholder}
          value={description}
          onChangeText={setDescription}
        />

        <Text style={styles.sectionLabel}>Tags</Text>
        <View style={styles.tagRow}>
          <TextInput
            style={[styles.input, { flex: 1, marginBottom: 0 }]}
            placeholder="Add tag..."
            placeholderTextColor={C.textPlaceholder}
            value={newTagText}
            onChangeText={setNewTagText}
            onSubmitEditing={handleAddTag}
          />
          <TouchableOpacity style={styles.addTagBtn} onPress={handleAddTag}>
            <Text style={styles.addTagBtnText}>Add</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.tagList}>
          {tags.map((tag) => (
            <View key={tag.id} style={styles.tagChip}>
              <Text style={styles.tagChipText}>{tag.name}</Text>
              <TouchableOpacity onPress={() => handleRemoveTag(tag.id)}>
                <Text style={styles.tagChipRemove}> ✕</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <Text style={styles.sectionLabel}>Questions</Text>
        {questions.map((q, idx) => (
          <CreateQuizQuestion
            key={q.id}
            question={q}
            questionNumber={idx + 1}
            onUpdate={(updates) =>
              setQuestions((prev) => prev.map((item) => (item.id === q.id ? { ...item, ...updates } : item)))
            }
            onRemove={() => setQuestions((prev) => prev.filter((item) => item.id !== q.id))}
          />
        ))}

        <TouchableOpacity style={styles.addQuestionBtn} onPress={handleAddQuestion}>
          <Text style={styles.addQuestionBtnText}>+ Add question</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.generateBtn} onPress={() => setGenerateModalVisible(true)}>
          <Text style={styles.generateBtnText}>✦ Generate with AI</Text>
        </TouchableOpacity>

        <Text style={styles.sectionLabel}>Further reading</Text>
        <TextInput
          style={[styles.input, { height: 100 }]}
          placeholder="Enter further reading..."
          placeholderTextColor={C.textPlaceholder}
          value={furtherReading}
          onChangeText={setFurtherReading}
          multiline
        />

        <Button onPress={handleUpdate} loading={loading} style={styles.submitBtn}>
          Save changes
        </Button>
      </ScrollView>

      <Modal visible={generateModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Generate question with AI</Text>
            <Text style={styles.modalDesc}>Describe the question topic.</Text>
            <TextInput
              style={[styles.input, { height: 80 }]}
              placeholder="Describe the question..."
              placeholderTextColor={C.textPlaceholder}
              value={generatePrompt}
              onChangeText={setGeneratePrompt}
              multiline
            />
            {generateError ? <FormError>{generateError}</FormError> : null}
            <Button onPress={handleGenerateQuestion} loading={generateLoading} style={styles.modalBtn}>
              Generate
            </Button>
            <TouchableOpacity onPress={() => setGenerateModalVisible(false)} style={styles.modalClose}>
              <Text style={styles.modalCloseText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {errorMessage ? (
        <ErrorModal message={errorMessage} onClose={() => setErrorMessage('')} />
      ) : null}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.secondaryLight },
  content: { padding: 16, paddingTop: 68, paddingBottom: 40 },
  back: { marginBottom: 12 },
  backText: { color: C.primaryMedium, fontSize: 15 },
  screenTitle: { fontSize: 22, fontWeight: '800', color: C.primary, marginBottom: 16 },
  titleInput: {
    borderWidth: 1, borderColor: C.border, borderRadius: 8, padding: 12,
    fontSize: 18, fontWeight: '700', backgroundColor: C.inputBg, color: C.textDark, marginBottom: 10,
  },
  input: {
    borderWidth: 1, borderColor: C.border, borderRadius: 8, padding: 12,
    fontSize: 15, backgroundColor: C.inputBg, color: C.textDark, marginBottom: 12,
  },
  sectionLabel: { fontSize: 15, fontWeight: '700', color: C.primary, marginBottom: 8, marginTop: 8 },
  tagRow: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  addTagBtn: {
    backgroundColor: C.primary, borderRadius: 8, paddingHorizontal: 16, justifyContent: 'center',
  },
  addTagBtnText: { color: C.secondaryLight, fontWeight: '600' },
  tagList: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 8 },
  tagChip: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: C.secondaryMedium,
    borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4, marginRight: 6, marginBottom: 4,
    borderWidth: 1, borderColor: C.secondary,
  },
  tagChipText: { fontSize: 13, color: C.primary },
  tagChipRemove: { fontSize: 13, color: C.errorMedium },
  addQuestionBtn: {
    borderWidth: 1, borderColor: C.primary, borderRadius: 8, borderStyle: 'dashed',
    padding: 12, alignItems: 'center', marginBottom: 8,
  },
  addQuestionBtnText: { color: C.primary, fontWeight: '600', fontSize: 15 },
  generateBtn: {
    borderWidth: 1, borderColor: C.primaryMedium, borderRadius: 8, borderStyle: 'dashed',
    padding: 12, alignItems: 'center', marginBottom: 16,
    backgroundColor: 'rgba(50,34,100,0.04)',
  },
  generateBtnText: { color: C.primaryMedium, fontWeight: '600', fontSize: 15 },
  submitBtn: { marginTop: 8 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-start' },
  modalBox: {
    backgroundColor: C.white, borderBottomLeftRadius: 20, borderBottomRightRadius: 20,
    padding: 24, paddingTop: 68,
  },
  modalTitle: { fontSize: 18, fontWeight: '700', color: C.primary, marginBottom: 8 },
  modalDesc: { fontSize: 14, color: C.textMuted, marginBottom: 12 },
  modalBtn: { marginTop: 8, marginBottom: 8 },
  modalClose: { alignItems: 'center', paddingVertical: 8 },
  modalCloseText: { color: C.textMuted, fontSize: 14 },
});
