import 'react-native-gesture-handler';
import React from 'react';
import { Provider } from 'react-redux';
import { ApolloProvider } from '@apollo/client/react';
import { store } from './src/store/store';
import { apolloClient } from './src/apollo/client';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <Provider store={store}>
      <ApolloProvider client={apolloClient}>
        <AppNavigator />
      </ApolloProvider>
    </Provider>
  );
}
