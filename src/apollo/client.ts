import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';
import { GRAPHQL_URI } from '../config';

export const apolloClient = new ApolloClient({
  link: new HttpLink({ uri: GRAPHQL_URI }),
  cache: new InMemoryCache(),
});
