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
