import React, { Component } from 'react'
import gql from 'graphql-tag'
import { Mutation } from 'react-apollo'
import PropTypes from 'prop-types'
import Router from 'next/router'

import ErrorMessage from './ErrorMessage'
import Form from './styles/Form'

import { CURRENT_USER_QUERY } from './User'

const RESET_PASSWORD_MUTATION = gql`
  mutation RESET_PASSWORD_MUTATION(
    $password: String!
    $confirmPassword: String!
    $resetToken: String!
  ) {
    resetPassword(
      password: $password
      confirmPassword: $confirmPassword
      resetToken: $resetToken
    ) {
      id
      name
      email
    }
  }
`

class ResetPassword extends Component {
  static propTypes = {
    resetToken: PropTypes.string.isRequired
  }
  state = {
    password: '',
    confirmPassword: ''
  }
  saveToState = e => {
    const { value, name } = e.target
    this.setState({ [name]: value })
  }
  render() {
    const { resetToken } = this.props
    const { password, confirmPassword } = this.state
    return (
      <Mutation
        mutation={RESET_PASSWORD_MUTATION}
        variables={{ resetToken, ...this.state }}
        refetchQueries={[{ query: CURRENT_USER_QUERY }]}
      >
        {(resetPassword, { error, loading }) => {
          return (
            <Form
              method="post"
              onSubmit={async e => {
                e.preventDefault()
                await resetPassword()
                this.setState({
                  password: '',
                  confirmPassword: ''
                })
                Router.push('/')
              }}
            >
              <fieldset disabled={loading} aria-busy={loading}>
                <h2>Reset your password!</h2>
                <ErrorMessage error={error} />
                <label htmlFor="password">
                  Password
                  <input
                    type="password"
                    name="password"
                    placeholder="e.g. y33zy"
                    value={password}
                    onChange={this.saveToState}
                  />
                </label>
                <label htmlFor="confirmPassword">
                  Confirm Password
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="e.g. y33zy"
                    value={confirmPassword}
                    onChange={this.saveToState}
                  />
                </label>
                <button type="submit">Reset Password!</button>
              </fieldset>
            </Form>
          )
        }}
      </Mutation>
    )
  }
}

export default ResetPassword
export { RESET_PASSWORD_MUTATION }
