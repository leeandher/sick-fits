# Advanced React

_Some helpful notes for developing modern applications in React. These may be a good reference!_

---

## Setting up Apollo Client (w/ Next, and SSR)

To set up the Apollo Client there is a little bit of boilerplate code that needs to be written. The goal of this code is to setup the Apollo Client with a bunch of configuration to be able to make queries and mutations connected to our database, as well as setting up error/loading handling, caching and re-fetching.

We do this with the help of a **Higher-Order Component (HOC)** which acts as a wrapper supplying props to the upper-level components. As per convention, wrapper HOCs are denoted in files prefixed with `with`. So in our case, as a DB Client, we can set up our Apollo Client in `withData.js`:

```js
// withData.js

import withApollo from 'next-with-apollo'
// Apollo-boost contains the Apollo Client with a lot of pre-configured best practices
// https://www.apollographql.com/docs/react/essentials/get-started/#apollo-boost
import ApolloClient from 'apollo-boost'
import { endpoint } from '../config'
```

The first thing to note is the imports at the top of the file. We need to import the Apollo Client HOC from `next-with-apollo` in order to send up server-side renderings. Our site should have it's queries fulfilled before initally loading the page, so that we don't get an empty page loaded to the user.

The `withApollo` HOC, accepts our client creation function (which we will declare in a bit) and returns another HOC. The other import is the actual client, which will parse and translate the GraphQL queries/mutations we're making on the front-end. We import it from `apollo-boost` since it's a supplied package pre-configured with a bunch of useful stuff, you can check out [with this link](https://www.apollographql.com/docs/react/essentials/get-started/#apollo-boost).

The endpoint is simply our database endpoint, which the client needs to send the queries too. This should come from a secure file, which is gitignored, like an `.env` or `config.js` file.

Now we can go ahead and setup our client creation function:

```js
// withData.js

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
```

In this function, we are extracting the headers from the front-end, and setting up a new `ApolloClient` configured with the endpoint and request settings. The request has its context set to include any headers, and cookies that we store to know whether or not the request is coming from a valid, authenticated user. This boilerplate can be a lot to parse buy it comes generally from the basic Apollo Docs.

Now that we've set up our client as an HOC, we need to setup the provider to allow our application to access the client. We do that using the next file: `_app.js`. We'll be wrapping our application with this HOC to provide the actual Client as a prop to our provider. Check out the following code:

```js
import App, { Container } from 'next/app'
import { ApolloProvider } from 'react-apollo'

import withData from '../lib/withData'

import Page from '../components/Page'

class SickApp extends App {
  // This static method is fired to enable crawling every page and fire off queries server-side before the first render
  static async getInitialProps({ Component, ctx }) {
    let pageProps = {}
    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }
    // This exposes the query to the user
    pageProps.query = ctx.query
    return { pageProps }
  }
  render() {
    const { Component, apollo, pageProps } = this.props
    return (
      <Container>
        {/* Apollo client comes from the withData HOC */}
        <ApolloProvider client={apollo}>
          <Page>
            <Component {...pageProps} />
          </Page>
        </ApolloProvider>
      </Container>
    )
  }
}

export default withData(SickApp)
```

It may be a lot to parse but we'll break it down. First of all the `ApolloProvider` (the actual JSX React Component) will be accepting our newly created client, so we import it into the file. Our client-creating-HOC is imported as well, and can be seen being used right at the bottom, within the `export` statement. Now, we have `apollo` accessible in our props, which actually contains the entire client so we can simply pass that to our `ApolloProvider`.

Now to setup the actual server-side rendering, we need to supply the returned data as props for our first load of the page components. We do that using the static `getInitialProps` method. It accepts the Component being rendered, and the context we assign. Inside here, we run the method `getInitialProps` on the component being rendered, essentially fetching its query before the first load, and returning it as props to the page.

What we've done now is have the browser fetch the page resources before loading the page, so that data is sent from the server directly to the user. Whatever the queries that we write in the component files will be prefetched and added to props to be used in the component.

```js
// _app.js
```

- boilerplate
  - withData.js
  - \_app.js
- renderprops
  - payload
  - data
  - error
  - loading
- HOCs
  - withItems (adds the Item Query etc)

renderprops with Query
take a function with the first arguement as (payload)

the Mutation component takes (mutationFunction and payload as arguments)

fieldset for disabling on submit

routing can be used to redirect on submit if e.prevent default stops from refreshing.
