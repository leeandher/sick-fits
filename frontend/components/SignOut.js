import React, { Component } from 'react'
import gql from 'graphql-tag'
import { Mutation } from 'react-apollo'
import Router from 'next/router'

import { CURRENT_USER_QUERY } from './User'

const SIGN_OUT_MUTATION = gql`
  mutation SIGN_OUT_MUTATION {
    signOut {
      message
    }
  }
`

class SignOut extends Component {
  render() {
    return (
      <Mutation
        mutation={SIGN_OUT_MUTATION}
        refetchQueries={[
          {
            query: CURRENT_USER_QUERY
          }
        ]}
      >
        {signOut => {
          return (
            <a
              onClick={async e => {
                const {
                  data: {
                    signOut: { message }
                  }
                } = await signOut()
                alert(message)
                Router.push('/signup')
              }}
            >
              Sign Out
            </a>
          )
        }}
      </Mutation>
    )
  }
}

export default SignOut
export { SIGN_OUT_MUTATION }
