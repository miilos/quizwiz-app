import React from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useQuery } from '@apollo/client/react';
import { FILTER_BY_TAGS } from '../graphql/queries';
import type { QuizOverview } from '../types';
import QuizCard from '../components/QuizCard';
import { C } from '../theme';

export default function TagQuizListScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { id } = route.params;

  const { loading, error, data } = useQuery<{ filterByTags: QuizOverview[] }>(FILTER_BY_TAGS, {
    variables: { tagIds: [id] },
  });

  const quizzes = data?.filterByTags ?? [];
  const tag = quizzes.flatMap((q) => q.tags ?? []).find((t) => Number(t.id) === id);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>
      <Text style={styles.title}>
        Quizzes tagged "{tag?.displayName ?? tag?.name ?? String(id)}"
      </Text>
      {loading ? (
        <ActivityIndicator size="large" color={C.primary} style={styles.loader} />
      ) : error ? (
        <Text style={styles.error}>Failed to load.</Text>
      ) : (
        <FlatList
          data={quizzes}
          keyExtractor={(q) => String(q.id)}
          renderItem={({ item }) => <QuizCard quiz={item} />}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.secondaryLight, padding: 16, paddingTop: 68 },
  back: { marginBottom: 12 },
  backText: { color: C.primaryMedium, fontSize: 15 },
  title: { fontSize: 20, fontWeight: '700', color: C.primary, marginBottom: 16 },
  loader: { marginTop: 40 },
  error: { color: C.errorMedium, textAlign: 'center', marginTop: 40 },
  list: { paddingBottom: 24 },
});
