export interface QuestionBase {
  id: number;
}

export interface Question extends QuestionBase {
  text: string;
  options: string[];
  correctAnswer: number[];
  type: string;
  position: number;
  explanation?: string;
}

export interface Author {
  id: number;
  username: string;
}

export interface Tag {
  id: number;
  name: string;
  displayName: string;
}

export interface QuizOverview {
  id: number;
  title: string;
  description?: string;
  furtherReading?: string;
  createdAt: string;
  questions: QuestionBase[];
  tags?: Tag[];
  author: Author;
}

export interface QuizDetails extends Omit<QuizOverview, 'questions'> {
  questions: Question[];
}

interface Answer {
  questionId: number;
  answers: number[];
}

export interface AttemptRef {
  quizId: number;
  answers: Answer[];
}

export interface User {
  id: number;
  email: string;
  username: string;
}

export interface UserState {
  id: number | null;
  email: string | null;
  username: string | null;
}

interface QuizAnswer {
  questionId: number;
  answers: number[];
  status: string;
}

export interface QuizAttempt {
  id: number;
  quiz: QuizOverview;
  user: User;
  answers: QuizAnswer[];
  correctAnswerCount: number;
  incorrectAnswerCount: number;
  percentageScore: number;
  attemptedAt?: string;
}

interface ProfileQuizAnswer {
  questionId: number;
  answers: number[];
  status: string;
}

export interface ProfileQuizAttempt {
  id: number;
  quiz: { id: number; title: string };
  answers: ProfileQuizAnswer[];
  attemptedAt: string;
  correctAnswerCount: number;
  incorrectAnswerCount: number;
  percentageScore: number;
}

export interface ProfileQuiz {
  id: number;
  title: string;
  description?: string;
  createdAt: string;
  questions: { id: number }[];
  tags: any[];
}

export interface AdminUser {
  id: number;
  username: string;
  email: string;
  roles: string[];
  quizzes: { id: number }[];
  quizAttempts: { id: number }[];
}

export interface ProfileUser {
  id: number;
  email: string;
  username: string;
  roles: string[];
  quizzes: ProfileQuiz[];
  quizAttempts: ProfileQuizAttempt[];
}

export interface QuestionDraft {
  id: number;
  text: string;
  options: string[];
  correctAnswers: number[];
  type: 'one' | 'multiple';
  explanation: string;
}

export interface TagDraft {
  id: number;
  name: string;
  editing: boolean;
}
