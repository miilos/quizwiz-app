import React from 'react';
import { View, Text, ScrollView, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Button from '../components/Button';
import { C } from '../theme';

export default function HomeScreen() {
  const navigation = useNavigation<any>();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.splash}>
        <Text style={styles.heading}>Learn what you love.</Text>
        <Text style={styles.body}>
          Excel in what you love with community-created quizzes, or make your own.
        </Text>
        <Button onPress={() => navigation.navigate('Login')} variant="secondary" style={styles.btn}>
          Get started
        </Button>
      </View>

      <View style={[styles.splash, styles.splashAlt]}>
        <Text style={styles.heading}>AI-assisted learning.</Text>
        <Text style={styles.body}>
          Get personalized learning reports from our AI learning assistant Merlin. Take a quiz now and get your first learning report.
        </Text>
        <Button onPress={() => navigation.navigate('Login')} variant="secondary" style={styles.btn}>
          Take a quiz now
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.primary,
  },
  content: {
    padding: 24,
    paddingTop: 76,
  },
  splash: {
    marginBottom: 48,
  },
  splashAlt: {
    marginBottom: 20,
  },
  heading: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 12,
    lineHeight: 36,
    color: C.secondaryLight,
  },
  body: {
    fontSize: 16,
    color: C.secondaryLight,
    lineHeight: 26,
    marginBottom: 20,
  },
  btn: {
    alignSelf: 'flex-start',
  },
});
