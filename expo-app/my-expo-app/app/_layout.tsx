import { ApolloClient, InMemoryCache, ApolloProvider, useQuery, gql } from '@apollo/client';
import { Key, ReactElement, JSXElementConstructor, ReactNode, ReactPortal } from 'react';
import { View, Text, FlatList } from 'react-native';

const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql', 
  cache: new InMemoryCache(),
});

const GET_ACCOUNTS = gql`
  query {
     accounts {
      id
      name
      email
      devices {
        id
      }
    }
  }
`;

const AccountList = () => {
  const { loading, error, data } = useQuery(GET_ACCOUNTS);

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;

  console.log('data', data);

  return (
    <FlatList
      data={data.accounts}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View>
          <Text>{item.name} ({item.email})</Text>  
            {item.devices?.map((device: { id: Key | null | undefined; name: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; }) => (
              <Text key={device.id}>- {device.name}</Text>
            ))}
        </View>
      )}
    />
  );
};

export default function App() {
  return (
    <ApolloProvider client={client}>
      <View>
        <Text>Accounts and Devices</Text>
        <AccountList />
      </View>
    </ApolloProvider>
  );
}
