import { Query } from 'react-apollo'
import { CURRENT_USER_QUERY } from './User'
import SignIn from './SignIn'

const PleaseSignIn = ({ children }) => (
  <Query query={CURRENT_USER_QUERY}>
    {({ data, loading }) => {
      if (loading) return <p>⚡ Loading... ⚡</p>
      if (!data.me) {
        return (
          <div>
            <SignIn samePage header="Sign in to continue" />
          </div>
        )
      }
      return children
    }}
  </Query>
)

export default PleaseSignIn
