import { ApolloClient, InMemoryCache } from '@apollo/client';

let client;

export const getClient = () => {
  if (!client) {
    client = new ApolloClient({
      uri: 'https://api.forta.network/graphql',
      cache: new InMemoryCache(),
    });
  }
  return client;
};
