import { gql } from '@apollo/client';

export const GET_ALL_QUIZZES = gql`
  query GetAllQuizzes {
    quizzes {
      id
      title
      description
      createdAt
      tags {
        id
        name
        displayName
      }
      questions {
        id
      }
      author {
        id
        username
      }
    }
  }
`;

export const SEARCH_QUIZZES = gql`
  query SearchQuizzes($query: SearchQuizInput!) {
    searchQuizzes(searchParams: $query) {
      id
      title
      description
      createdAt
      tags {
        id
        name
        displayName
      }
      questions {
        id
      }
      author {
        id
        username
      }
    }
  }
`;

export const GET_QUIZ = gql`
  query GetQuiz($id: Int!) {
    quiz(id: $id) {
      id
      title
      description
      furtherReading
      createdAt
      tags {
        id
        name
        displayName
      }
      questions {
        id
        text
        options
        correctAnswer
        type
        position
        explanation
      }
      author {
        id
        username
      }
    }
  }
`;

export const GET_QUIZ_FOR_EDIT = gql`
  query GetQuizForEdit($id: Int!) {
    quiz(id: $id) {
      id
      title
      description
      furtherReading
      tags {
        id
        name
        displayName
      }
      questions {
        id
        text
        options
        correctAnswer
        type
        explanation
      }
    }
  }
`;

export const FILTER_BY_TAGS = gql`
  query FilterByTags($tagIds: [Int!]) {
    filterByTags(tagIds: $tagIds) {
      id
      title
      description
      createdAt
      tags {
        id
        name
        displayName
      }
      questions {
        id
      }
      author {
        id
        username
      }
    }
  }
`;

export const GET_ATTEMPT = gql`
  query GetAttempt($id: Int!) {
    attempt(id: $id) {
      id
      quiz {
        id
        title
        description
        furtherReading
        createdAt
        tags {
          id
          name
          displayName
        }
        questions {
          id
          text
          options
          correctAnswer
          type
          position
          explanation
        }
        author {
          id
          username
        }
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
    }
  }
`;
