import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { Tag as TagType } from '../types';
import { C } from '../theme';

interface TagProps {
  tag: TagType;
}

export default function Tag({ tag }: TagProps) {
  const navigation = useNavigation<any>();
  return (
    <TouchableOpacity
      style={styles.tag}
      onPress={() => navigation.navigate('Quizzes', { screen: 'TagQuizList', params: { id: tag.id } })}
    >
      <Text style={styles.text}>{tag.displayName ?? tag.name}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  tag: {
    backgroundColor: C.secondaryMedium,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 6,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: C.secondary,
  },
  text: {
    fontSize: 12,
    color: C.primary,
    fontWeight: '600',
  },
});
