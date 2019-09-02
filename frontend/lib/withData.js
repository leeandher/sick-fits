import withApollo from 'next-with-apollo'
// Apollo-boost contains the Apollo Client with a lot of pre-configured best practices
// https://www.apollographql.com/docs/react/essentials/get-started/#apollo-boost
import ApolloClient from 'apollo-boost'
import { SERVER_ENDPOINT } from '../config'
import { LOCAL_STATE_QUERY } from '../components/Cart'

function createClient({ headers }) {
  return new ApolloClient({
    uri:
      process.env.NODE_ENV === 'development'
        ? DEVELOPMENT_ENDPOINT
        : PRODUCTION_ENDPOINT,
    request: operation => {
      operation.setContext({
        fetchOptions: {
          // Cookies are included in requests, so we know if the user is logged in
          credentials: 'include',
        },
        headers,
      })
    },
    // local data
    clientState: {
      resolvers: {
        Mutation: {
          toggleCart(_, variables, { cache }) {
            // 1. Read the cartOpen value from the cache
            const { cartOpen } = cache.readQuery({ query: LOCAL_STATE_QUERY })
            // 2. Write the new cartOpen value to the cache
            const newData = { data: { cartOpen: !cartOpen } }
            cache.writeData(newData)
            return newData
          },
        },
      },
      defaults: {
        cartOpen: false,
      },
    },
  })
}

export default withApollo(createClient)
