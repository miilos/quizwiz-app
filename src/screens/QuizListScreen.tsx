import React from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { useQuery, useLazyQuery } from '@apollo/client/react';
import { GET_ALL_QUIZZES, SEARCH_QUIZZES } from '../graphql/queries';
import type { QuizOverview } from '../types';
import QuizCard from '../components/QuizCard';
import SearchBar from '../components/SearchBar';
import { C } from '../theme';

export default function QuizListScreen() {
  const { loading, error, data } = useQuery<{ quizzes: QuizOverview[] }>(GET_ALL_QUIZZES);
  const [searchQuizzes, { loading: searchLoading, data: searchData }] =
    useLazyQuery<{ searchQuizzes: QuizOverview[] }>(SEARCH_QUIZZES);

  const handleSearch = (keywords: string) => {
    if (!keywords) return;
    searchQuizzes({ variables: { query: { keywords } } });
  };

  const isLoading = searchLoading || loading;
  const quizzes = searchData?.searchQuizzes ?? data?.quizzes ?? [];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Browse quizzes</Text>
      <SearchBar onSearch={handleSearch} />
      {isLoading ? (
        <ActivityIndicator size="large" color={C.primary} style={styles.loader} />
      ) : error ? (
        <Text style={styles.error}>Failed to load quizzes.</Text>
      ) : (
        <FlatList
          data={quizzes}
          keyExtractor={(q) => String(q.id)}
          renderItem={({ item }) => <QuizCard quiz={item} />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.secondaryLight, padding: 16, paddingTop: 68 },
  title: { fontSize: 22, fontWeight: '800', color: C.primary, marginBottom: 16 },
  loader: { marginTop: 40 },
  error: { color: C.errorMedium, textAlign: 'center', marginTop: 40 },
  list: { paddingBottom: 24 },
});
