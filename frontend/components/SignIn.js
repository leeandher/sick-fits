import React, { Component } from 'react'
import PropTypes from 'prop-types'
import gql from 'graphql-tag'
import { Mutation } from 'react-apollo'
import Router from 'next/router'

import ErrorMessage from './ErrorMessage'
import Form from './styles/Form'

import { CURRENT_USER_QUERY } from './User'

const SIGN_IN_MUTATION = gql`
  mutation SIGN_IN_MUTATION($email: String!, $password: String!) {
    signIn(email: $email, password: $password) {
      id
      name
      email
    }
  }
`

class SignIn extends Component {
  static propTypes = {
    header: PropTypes.string,
    samePage: PropTypes.boolean
  }
  state = {
    email: '',
    password: ''
  }
  saveToState = e => {
    const { value, name } = e.target
    this.setState({ [name]: value })
  }
  render() {
    const { header, samePage } = this.props
    const { email, password } = this.state
    return (
      <Mutation
        mutation={SIGN_IN_MUTATION}
        variables={this.state}
        refetchQueries={[{ query: CURRENT_USER_QUERY }]}
      >
        {(signIn, { error, loading }) => {
          return (
            <Form
              method="post"
              onSubmit={async e => {
                e.preventDefault()
                await signIn()
                this.setState({
                  email: '',
                  name: '',
                  password: ''
                })
                if (!samePage) Router.push('/')
              }}
            >
              <fieldset disabled={loading} aria-busy={loading}>
                <h2>{header ? header : 'Already have an account?'}</h2>
                <ErrorMessage error={error} />
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
                <button type="submit">Sign In!</button>
              </fieldset>
            </Form>
          )
        }}
      </Mutation>
    )
  }
}

export default SignIn
export { SIGN_IN_MUTATION }
