# Advanced React

_Some helpful notes for developing modern applications in React. These may be a good reference!_

---

## Client-side GraphQL with Apollo

There are going to be certain situations where you'll want data throughout your application in one easy way to fetch it. Usually you'd reach for Redux or the React Context API in these situations, but you're already wrapping you application in the `<ApolloProvider>` HOC, so why add some more dependencies? Plus, you already have some nice GraphQL queries to your backend, just add some special directives and you'll be able to interface directly with your client store as if it were a full fledged database.

This entire concept boils down to using this one directive: **@client**. This tells your Apollo client not to interface with the DB, and instead try to fetch it from the store client-side. Take a look at the following snippet:

```js
const LOCAL_STATE_QUERY = gql`
  query LOCAL_STATE_QUERY {
    navStatus @client
  }
`
const TOGGLE_NAV_STATUS_MUTATION = gql`
  mutation TOGGLE_NAV_STATUS_MUTATION {
    toggleNavStatus @client
  }
`
```

Now this would work, but it doesn't have a resolver/data-store to run from. So when you head over to your HOC where you initialize your data with the  `clientState` property.

```js
new ApolloClient({
  // rest of declarations on ApolloClient
  // ...
  clientState: {
    defaults: {
      navStatus: false
    },
    resolvers: {
      Mutation: {
        toggleNavStatus(_, variables, { cache }) {
          // 1. Read the navStatus value from the cache
          const { navStatus } = cache.readQuery({ query: LOCAL_STATE_QUERY })
          // 2. Write the new navStatus value to the cache
          const newData = { data: { navStatus: !navStatus } }
          cache.writeData(newData)
          return newData
        }
      }
    }
  }
})
```

Diagnosing this a bit you can see that the resolver for the above mutation set up to read and write from the cache as if it were some concrete data store, and return the information the same you would from an actual backend. 

The query also doesn't have a query because it's actually reaching for a value that is stored as a value on the `clientState` already, so the simple query of asking for its value doesn't actually need a resolver!

It may look odd, but the mutations also ignore the first parameter, with the second and third being the `variables` and the `context` objects. The first parameter isn't too important, and can usually be skipped, while the context can be de-structured into the `client` and `cache` objects as well as the `getCacheKey` function. For more info check out: https://www.apollographql.com/docs/react/essentials/local-state/#local-resolvers

## Displaying data
 - nesting queries
 - removing ugly render props