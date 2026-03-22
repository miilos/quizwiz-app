import { gql } from '@apollo/client';

export const CREATE_ATTEMPT = gql`
  mutation CreateAttempt($attempt: QuizAttemptInput) {
    createAttempt(attempt: $attempt) {
      id
      quiz {
        id
        title
      }
      user {
        id
        username
      }
      answers {
        questionId
        answers
        status
      }
      correctAnswerCount
      incorrectAnswerCount
      percentageScore
      attemptedAt
    }
  }
`;

export const CREATE_QUIZ = gql`
  mutation CreateQuiz($quiz: QuizInput!) {
    createQuiz(quiz: $quiz)
  }
`;

export const UPDATE_QUIZ = gql`
  mutation UpdateQuiz($id: Int!, $quiz: UpdateQuizInput!) {
    updateQuiz(id: $id, quiz: $quiz)
  }
`;

export const DELETE_QUIZ = gql`
  mutation DeleteQuiz($id: Int!) {
    deleteQuiz(id: $id)
  }
`;
