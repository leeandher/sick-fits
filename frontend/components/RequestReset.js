import React, { Component } from 'react'
import gql from 'graphql-tag'
import { Mutation } from 'react-apollo'

import ErrorMessage from './ErrorMessage'
import Form from './styles/Form'

const RESET_REQUEST_MUTATION = gql`
  mutation RESET_REQUEST_MUTATION($email: String!) {
    requestReset(email: $email) {
      message
    }
  }
`

class RequestReset extends Component {
  state = {
    email: '',
    message: '',
  }
  saveToState = e => {
    const { value, name } = e.target
    this.setState({ [name]: value })
  }
  render() {
    const { email, message } = this.state
    return (
      <Mutation mutation={RESET_REQUEST_MUTATION} variables={{ email }}>
        {(requestReset, { error, loading, called }) => {
          return (
            <Form
              data-test="form"
              method="post"
              onSubmit={async e => {
                e.preventDefault()
                const { data } = await requestReset()
                this.setState({
                  email: '',
                  message: data.requestReset.message,
                })
              }}
            >
              <fieldset disabled={loading} aria-busy={loading}>
                <h2>Forgot your password?</h2>
                <ErrorMessage error={error} />
                {!error && !loading && called && <p>{message}</p>}
                <label htmlFor="email">
                  Email
                  <input
                    type="text"
                    name="email"
                    placeholder="e.g. kanye@west.com"
                    value={email}
                    onChange={this.saveToState}
                  />
                </label>
                <button type="submit">Request Reset!</button>
              </fieldset>
            </Form>
          )
        }}
      </Mutation>
    )
  }
}

export default RequestReset
export { RESET_REQUEST_MUTATION }
