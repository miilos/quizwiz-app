// @ts-nocheck
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { useAppSelector } from '../store/hooks';
import { Ionicons } from '@expo/vector-icons';
import { C } from '../theme';

import QuizListScreen from '../screens/QuizListScreen';
import QuizDetailsScreen from '../screens/QuizDetailsScreen';
import QuizAttemptScreen from '../screens/QuizAttemptScreen';
import QuizResultsScreen from '../screens/QuizResultsScreen';
import TagQuizListScreen from '../screens/TagQuizListScreen';
import AttemptScreen from '../screens/AttemptScreen';
import CreateQuizScreen from '../screens/CreateQuizScreen';
import EditQuizScreen from '../screens/EditQuizScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import AdminScreen from '../screens/admin/AdminScreen';
import AdminEditUserScreen from '../screens/admin/AdminEditUserScreen';
import AdminCreateUserScreen from '../screens/admin/AdminCreateUserScreen';
import type { AdminUser } from '../types';

export type QuizzesStackParamList = {
  QuizList: undefined;
  QuizDetails: { id: number };
  QuizAttempt: { quizId: number };
  QuizResults: { attemptId: number };
  TagQuizList: { id: number };
  AttemptReview: { id: number };
};

export type CreateStackParamList = {
  CreateQuiz: undefined;
  EditQuiz: { id: number };
};

export type LearningStackParamList = {
  MyLearning: undefined;
  AttemptReview: { id: number };
};

export type ProfileStackParamList = {
  MyProfile: undefined;
  EditQuiz: { id: number };
};

export type AdminStackParamList = {
  Admin: undefined;
  AdminEditUser: { user: AdminUser };
  AdminCreateUser: undefined;
  EditQuiz: { id: number };
};

const Tab = createBottomTabNavigator();
const QuizzesStack = createStackNavigator<QuizzesStackParamList>();
const CreateStack = createStackNavigator<CreateStackParamList>();
const ProfileStack = createStackNavigator<ProfileStackParamList>();
const AdminStack = createStackNavigator<AdminStackParamList>();

function QuizzesNavigator() {
  return (
    <QuizzesStack.Navigator screenOptions={{ headerShown: false }}>
      <QuizzesStack.Screen name="QuizList" component={QuizListScreen} />
      <QuizzesStack.Screen name="QuizDetails" component={QuizDetailsScreen} />
      <QuizzesStack.Screen name="QuizAttempt" component={QuizAttemptScreen} />
      <QuizzesStack.Screen name="QuizResults" component={QuizResultsScreen} />
      <QuizzesStack.Screen name="TagQuizList" component={TagQuizListScreen} />
      <QuizzesStack.Screen name="AttemptReview" component={AttemptScreen} />
    </QuizzesStack.Navigator>
  );
}

function CreateNavigator() {
  return (
    <CreateStack.Navigator screenOptions={{ headerShown: false }}>
      <CreateStack.Screen name="CreateQuiz" component={CreateQuizScreen} />
      <CreateStack.Screen name="EditQuiz" component={EditQuizScreen} />
    </CreateStack.Navigator>
  );
}

function ProfileNavigator() {
  return (
    <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
      <ProfileStack.Screen name="MyProfile" component={ProfileScreen} />
      <ProfileStack.Screen name="EditQuiz" component={EditQuizScreen} />
    </ProfileStack.Navigator>
  );
}

function AdminNavigator() {
  return (
    <AdminStack.Navigator screenOptions={{ headerShown: false }}>
      <AdminStack.Screen name="Admin" component={AdminScreen} />
      <AdminStack.Screen name="AdminEditUser" component={AdminEditUserScreen} />
      <AdminStack.Screen name="AdminCreateUser" component={AdminCreateUserScreen} />
      <AdminStack.Screen name="EditQuiz" component={EditQuizScreen} />
    </AdminStack.Navigator>
  );
}

export default function MainNavigator() {
  const userId = useAppSelector((s) => s.user.id);
  
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: C.secondaryLight, borderTopColor: C.secondaryMedium },
        tabBarActiveTintColor: C.primary,
        tabBarInactiveTintColor: C.primaryLight,
      }}
    >
      <Tab.Screen
        name="Quizzes"
        component={QuizzesNavigator}
        options={{
          tabBarLabel: 'Quizzes',
          tabBarIcon: ({ color, size }) => <Ionicons name="book-outline" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Create"
        component={CreateNavigator}
        options={{
          tabBarLabel: 'Create',
          tabBarIcon: ({ color, size }) => <Ionicons name="add-circle-outline" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileNavigator}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => <Ionicons name="person-outline" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Admin"
        component={AdminNavigator}
        options={{
          tabBarLabel: 'Admin',
          tabBarIcon: ({ color, size }) => <Ionicons name="shield-outline" size={size} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}
