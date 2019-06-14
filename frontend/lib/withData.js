import withApollo from 'next-with-apollo'
// Apollo-boost contains the Apollo Client with a lot of pre-configured best practices
// https://www.apollographql.com/docs/react/essentials/get-started/#apollo-boost
import ApolloClient from 'apollo-boost'
import { endpoint } from '../config'

function createClient({ headers }) {
  return new ApolloClient({
    uri: process.env.NODE_ENV === 'development' ? endpoint : endpoint,
    request: operation => {
      operation.setContext({
        fetchOptions: {
          // Cookies are included in requests, so we know if the user is logged in
          credentials: 'include'
        },
        headers
      })
    }
  })
}

export default withApollo(createClient)
